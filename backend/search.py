import helpers

import tokenise

from auth import DEFAULT_PIC


def do_search(name, type, serving_size, time_to_cook, ingredients,
              step_key_words):
    '''
    Search all recipes with given property
    :param name: recipe name
    :param type: recipe type(e.g. lunch)
    :param serving_size: number of people serving
    :param time_to_cook: cooking time
    :param ingredients: ingredients
    :param step_key_words: words in recipe's steps(e.g. baking)
    :return: search result
    '''
    con = helpers.get_db_conn()
    cur = con.cursor()

    query = """
        select distinct R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
            R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + \
            DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories, (select count(*) from Likes L where 
            R.recipe_id = L.recipe_id) as likes,
            (select count(*) from Comments C where R.recipe_id = C.recipe_id) 
            as comments
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) 
            RP on R.recipe_id = RP.recipe_id
            left outer join RecipeIngredients I on R.recipe_id = I.recipe_id
            left outer join RecipeSteps S on I.recipe_id = S.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        """

    and_needed = False
    args = tuple()

    if name is not None or type is not None or serving_size is not None or \
            time_to_cook is not None or ingredients is not None or \
            step_key_words is not None:
        query += "where "

    if name is not None:
        query += "match(R.name) against (%s in natural language mode) "
        query = query.replace("select distinct",
                              "select distinct match(R.name) against (%s in "
                              "natural language mode) as name_relevance, ")
        # query += "R.name like %s "
        args = args + (name, name,)
        # args = args + ('%'+name+'%',)
        and_needed = True

    if type is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "type = %s "
        args = args + (type,)

    if serving_size is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "serving_size = %s "

        args = args + (int(serving_size),)

    if time_to_cook is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True

        query += "time_to_cook = %s "

        args = args + (int(time_to_cook),)

    if ingredients is not None:
        if and_needed:
            query += "AND "
        else:
            and_needed = True
        query += "match(I.ingredient_name) against (%s in natural language " \
                 "mode) "
        args = args + (ingredients,)

    if step_key_words is not None:
        if and_needed:
            query += "AND "
        query += "match(S.step_text) against (%s in natural language mode)"
        args = args + (step_key_words,)

    order_by_needed = True
    if name is not None:
        query += "ORDER BY "
        order_by_needed = False
        query += "name_relevance desc"

    cur.execute(query, args)
    results = cur.fetchall()
    if isinstance(results, tuple):
        results = []

    ## End search results now if this is an advanced search
    if type is not None or serving_size is not None or time_to_cook is not None\
        or ingredients is not None or step_key_words is not None:
        con.close()
        return results

    ## Stage 2: include name matches for ingredients
    # Sorts by number of ingredients which contain the name
    if name is not None:
        query = """
        select count(*), R.recipe_id, R.name, R.creation_time, R.edit_time,
            R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
            R.description,
            U.first_name, U.last_name, COALESCE(U.profile_pic_path, '""" + \
                DEFAULT_PIC + """') as profile_pic_path,
            U.user_id, R.calories, (select count(*) from Likes L where 
            R.recipe_id = L.recipe_id) as likes,
            (select count(*) from Comments C where R.recipe_id = C.recipe_id) 
            as comments
        from Recipes R
            left outer join (select * from RecipePhotos where photo_no = 0) 
            RP on R.recipe_id = RP.recipe_id
            left outer join RecipeIngredients I on R.recipe_id = I.recipe_id
            join Users U on R.created_by_user_id = U.user_id 
        where match(I.ingredient_name) against (%s in natural language mode)
        group by R.recipe_id
        order by count(*) desc
        """
        cur.execute(query, (name,))
        result2 = cur.fetchall()
        for result in result2:
            is_not_duplicate = True
            for r in results:
                if result['recipe_id'] == r['recipe_id']:
                    is_not_duplicate = False
                    break
            if is_not_duplicate:
                results.append(result)

        ## Stage 3: include name matches for steps
        # Sorts by number of steps which contain the name
        if name is not None:
            query = """
            select count(*), R.recipe_id, R.name, R.creation_time, R.edit_time,
                R.time_to_cook, R.type, R.serving_size, RP.photo_path, 
                R.description,
                U.first_name, U.last_name, COALESCE(U.profile_pic_path, 
                '""" + DEFAULT_PIC + """') as profile_pic_path,
                U.user_id, R.calories, (select count(*) from Likes L where 
                R.recipe_id = L.recipe_id) as likes,
                (select count(*) from Comments C where R.recipe_id = 
                C.recipe_id) as comments
            from Recipes R
                left outer join (select * from RecipePhotos where photo_no = 
                0) RP on R.recipe_id = RP.recipe_id
                left outer join RecipeSteps S on R.recipe_id = S.recipe_id
                join Users U on R.created_by_user_id = U.user_id 
            where match(S.step_text) against (%s in natural language mode)
            group by R.recipe_id
            order by count(*) desc
            """
            cur.execute(query, (name,))
            result2 = cur.fetchall()
            for result in result2:
                is_not_duplicate = True
                for r in results:
                    if result['recipe_id'] == r['recipe_id']:
                        is_not_duplicate = False
                        break
                if is_not_duplicate:
                    results.append(result)
    return results


def add_search_history(token, name, ingredients, step):
    '''
    Add one search record to search_history database
    :param token: token of user does the action
    :param name: recipe name
    :param ingredients: recipe ingredients
    :param step: recipe step
    :return: -1 for invalid token
    '''
    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return -1

    cur = con.cursor()

    if name is not None:
        term = name
    elif ingredients is not None:
        term = ingredients
    elif step is not None:
        term = step
    else:
        con.close()
        return

    query = ''' select * from SearchHistory where search_term = %s and 
    user_id = %s'''
    cur.execute(query, (term, int(u_id)))
    if len(cur.fetchall()) > 0:
        query = '''update SearchHistory set time=UTC_TIMESTAMP() where 
        search_term = %s and user_id = %s '''
        cur.execute(query, (term, int(u_id)))
    else:
        query = '''
                insert into SearchHistory(user_id, time, search_term) 
            values (%s, UTC_TIMESTAMP(), %s)
        '''
        cur.execute(query, (int(u_id), term,))

    auto_update_search_history(token)

    con.commit()
    con.close()


def get_search_history(token):
    '''
    Get all search history of user with given token
    :param token: user's token
    :return: search history
    '''
    con = helpers.get_db_conn()
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        con.close()
        return []

    query = """
        select search_term, time
        from SearchHistory
        where user_id=%s
        order by time desc
    """
    cur = con.cursor()
    cur.execute(query, (u_id,))
    result = cur.fetchall()
    con.close()
    return result


def delete_search_history(token, search_term, search_time):
    '''
    Delete given user's search history with given search term and time
    :param token: given user's token
    :param search_term: search term
    :param search_time: time did this search
    :return:
    '''
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        return -1

    con = helpers.get_db_conn()
    cur = con.cursor()

    query = '''delete from SearchHistory where user_id=%s and search_term=%s 
    and time=%s'''
    cur.execute(query, (int(u_id), search_term, search_time,))

    con.commit()
    con.close()
    return 0


def auto_update_search_history(token):
    '''
    update the search history table to ensure only 10 history records
    :param token: token of user
    :return: -1 for invalid token, otherwise 0
    '''
    u_id = tokenise.token_to_id(token)
    if u_id < 0:
        return -1

    con = helpers.get_db_conn()
    cur = con.cursor()

    query = '''select * from SearchHistory where user_id=%s order by time'''

    cur.execute(query, (int(u_id),))
    result = cur.fetchall()

    if len(result) <= 10:
        return 0

    search_term = result[0]['search_term']
    search_time = result[0]['time']

    query = '''delete from SearchHistory where user_id=%s and search_term=%s 
    and time=%s'''
    cur.execute(query, (int(u_id), search_term, search_time,))

    con.commit()
    return 0
