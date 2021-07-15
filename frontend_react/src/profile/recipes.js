import React, {useEffect, useState} from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

import RecipeList from '../recipe/list';


async function requestRecipes(user_id) {
    let response = await fetch('http://localhost:5000/profile/recipes?' + new URLSearchParams({'user_id': user_id}), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).catch(e => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}


function ProfileRecipes(props) {
    const [recipeData, setRecipeData] = useState([])
    const [fetched, setFetched] = useState(false)
    const [success, setSuccess] = useState(false)

    async function processId() {
        let response = await requestRecipes(props.userID)
            .catch(e => {

            });

        if (response != null) {
            setRecipeData(response)
            setSuccess(true);
        }
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processId();
    }, []);

    if (success) {
        return (
            recipeData.length === 0
            ? <Col>
                <p style={{textAlign: 'center'}}> This user hasn't created any recipes. </p>
            </Col>
            : <RecipeList recipeData={recipeData} setRecipeData={setRecipeData}/>
        );
    } else {
        return (
            <div style={{textAlign: "center"}}>
                <Spinner animation={"grow"}/>
            </div>
        );
    }

}

export default ProfileRecipes;