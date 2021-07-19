import React, {useEffect, useState} from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";

import ReactTimeAgo from "react-time-ago";

import Slider from '@material-ui/core/Slider';



function RecipeList(props) {
    const [recipeData, setRecipeData] = useState(props.recipeData);
    const [recipeDataFiltered, setRecipeDataFiltered] = useState(props.recipeData);
    const [mealFilters, setMealFilters] = useState(initMealFilters());
    const [activeMealFilter, setActiveMealFilter] = useState([]);
    const [servingFilters, setServingFilters] = useState(initServingFilters());
    const [activeServingFilters, setActiveServingFilters] = useState([Math.min(...servingFilters), Math.max(...servingFilters)]);
    const [timeFilters, setTimeFilters] = useState(initTimeFilters());
    const [activeTimeFilters, setActiveTimeFilters] = useState([Math.min(...timeFilters), Math.max(...timeFilters)]);
    const [activePage, setActivePage] = useState(0);
    const [hoveredRecipeId, setHoveredRecipeId] = useState(-1)
    const recipesPerPage = 4;
    const history = useHistory();

    function generateCard(recipe, index) {
        return(
            <div style={{padding:"1em"}}  key={index}>

                <Card
                      onMouseEnter={() => setHoveredRecipeId(recipe.recipe_id)}
                      onMouseLeave={() => setHoveredRecipeId(-1)}
                      className={hoveredRecipeId === recipe.recipe_id ? 'shadow-lg' : 'shadow-sm'}>
                    <div style={{color:'black', textDecoration: 'none', cursor:'pointer'}} role="link" onClick={()=>history.push("/recipe/" + recipe.recipe_id)} >
                        <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                        <Card.Body style={{textAlign: "center"}}>
                            <Card.Title className={"text-truncate"}>{recipe.name}</Card.Title>
                            <Card.Text className="text-truncate" style={{height:"1.5em", textDecoration: 'none'}}>
                                {recipe.description == null ? "No description available" : recipe.description}
                            </Card.Text>
                            <div style={{textAlign: "center"}}>
                                <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"2em 0em"}}><tbody>
                                <tr>
                                    <th style={{fontSize:"95%"}}> {recipe.time_to_cook} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.serving_size} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.type} </th>
                                    <th style={{fontSize:"95%"}}> {recipe.calories == null ? "N/A" : recipe.calories }</th>
                                </tr>
                                <tr>
                                    <td style={{fontSize:"80%"}}> MINS </td>
                                    <td style={{fontSize:"80%"}}> SERVES </td>
                                    <td style={{fontSize:"80%"}}> MEAL </td>
                                    <td style={{fontSize:"80%"}}> CAL </td>
                                </tr>
                                </tbody></table>
                            </div>

                        </Card.Body>


                    <Card.Footer
                        className={"text-truncate"}>
                        <Row>
                            <Col sm={2} className={"mx-auto my-auto"}>

                                <Link  to={"/profile/" + recipe.user_id} >
                                    <Image  onClick={(e) => e.stopPropagation()} src={"http://127.0.0.1:5000/img/" + recipe.profile_pic_path} alt="Profile Picture" roundedCircle width="40em"/>
                                </Link>
                            </Col>
                            <Col sm={10}>
                                 <Link  to={"/profile/" + recipe.user_id}>
                                     <div onClick={(e) => e.stopPropagation()}> {recipe.first_name + " " + recipe.last_name} <br/> </div> </Link>
                                <small className={"text-muted"}>

                                    {"Created "}
                                    <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                                    {recipe.edit_time != null ? <>
                                            {" | Modified "}
                                            <ReactTimeAgo date={new Date(recipe.edit_time)} locale="en-US"/> </>
                                        : ""}
                                </small>
                            </Col>
                        </Row>
                    </Card.Footer>
                        </div>
                </Card>
            </div>
        )
    }

    function initMealFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.type);
        }
        let mealTypes = ["Breakfast", "Brunch", "Lunch", "Dinner", "Snack"];
        return Array.from(tempSet).sort(function(a, b) {
            return mealTypes.indexOf(a) - mealTypes.indexOf(b);
        });
    }
    
    function toggleMealFilter(type, checked) {
        let tempArray = Array.from(activeMealFilter);
        if (checked) {
            tempArray.push(type);
        } else {
            tempArray.splice(tempArray.indexOf(type), 1)
        }
        setActiveMealFilter(tempArray);
    }

    function initServingFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.serving_size);
        }
        return Array.from(tempSet).sort();
    }

    function initTimeFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.time_to_cook);
        }
        return Array.from(tempSet).sort();
    }

    function filterRecipes() {
        let tempArray = Array.from(recipeData);
        if (activeMealFilter.length !== 0) {
            tempArray = tempArray.filter(function(e) {
                return activeMealFilter.includes(e.type);
            })
        }
        tempArray = tempArray.filter(function(e) {
            return e.serving_size >= activeServingFilters[0] && e.serving_size <= activeServingFilters[1];
        })
        tempArray = tempArray.filter(function(e) {
            return e.time_to_cook >= activeTimeFilters[0] && e.time_to_cook <= activeTimeFilters[1];
        })
        setRecipeDataFiltered(tempArray);
        if (activePage > Math.ceil(tempArray.length/recipesPerPage) - 1) {
            setActivePage(Math.ceil(tempArray.length/recipesPerPage) - 1);
        }
    }

    function clearFilters() {
        setActiveMealFilter([]);
        setActiveServingFilters([Math.min(...servingFilters), Math.max(...servingFilters)]);
        setActiveTimeFilters([Math.min(...timeFilters), Math.max(...timeFilters)]);
        let checkboxes = document.getElementsByClassName("form-check-input");
        for (let checkbox of checkboxes) {  
            checkbox.checked = false;
        }
    }

    function sortComparator(key) {
        return function(a, b) {
            switch (key) {
                case "creation_time": {
                    let aDate = Date.parse(a[key]);
                    let bDate = Date.parse(b[key]);
                    if (aDate > bDate) return 1;
                    else if (aDate < bDate) return -1;
                    return 0;
                }
                case "edit_time": {
                    let aDate = a[key] == null ? Date.parse(a["creation_time"]) : Date.parse(a[key]);
                    let bDate = b[key] == null ? Date.parse(b["creation_time"]) : Date.parse(b[key]);
                    if (aDate > bDate) return 1;
                    else if (aDate < bDate) return -1;
                    return 0;
                }
                default: {
                    if (a[key] > b[key]) return 1;
                    else if (a[key] < b[key]) return -1;
                    return 0;
                }
            }
        }
    }

    function sortChange(e) {
        let key = "creation_time";
        switch (e.target.value) {
            case "0":
                setRecipeData(props.recipeData);
                return;
            case "2":
                key = "edit_time"
                break;
            default:
                key = "creation_time";
        }
        let copy = Array.from(props.recipeData);
        copy.sort(sortComparator(key));
        copy.reverse();
        setRecipeData(copy);
    }

    useEffect(() => {
        filterRecipes();
    }, [recipeData, activeMealFilter, activeServingFilters, activeTimeFilters])

    return (<>
        <Col sm={3}>
        <Row>
            <h4>Filter</h4><br/>
        </Row>
        <Row style={{marginTop:'1em'}}>
        <h6>Meal type</h6>
        </Row>
        {mealFilters.map((t, index) => 
            <Row key={index}><Form.Check type='checkbox' label={t} onChange={e => toggleMealFilter(t, e.target.checked)}/></Row>
        )}
        <Row style={{marginTop:'1em'}}>
        <h6>Serving Size</h6>
        </Row >
        <Row style={{width: '80%', marginTop:"2em"}}>
        <Slider value={activeServingFilters} min={Math.min(...servingFilters)} max={Math.max(...servingFilters)} valueLabelDisplay="on" onChange={(e, v) => setActiveServingFilters(v)}/>
        </Row>
        <Row style={{marginTop:'1em'}}>
        <h6>Time to cook</h6>
        </Row >
        <Row style={{width: '80%', marginTop:"2em"}}>
        <Slider value={activeTimeFilters} min={Math.min(...timeFilters)} max={Math.max(...timeFilters)} valueLabelDisplay="on" onChange={(e, v) => setActiveTimeFilters(v)}/>
        </Row>
        <Row style={{marginTop:'1em'}}>
        <Button size="sm" variant="outline-secondary" onClick={clearFilters}>Clear all</Button>
        </Row>
        </Col>
        <Col sm={9}>
        <Row>
            <Col sm={8} />
            <Col sm={4}>
            <Form.Group as={Row}>
                <Form.Label column sm={4}>Sort by:</Form.Label>
                <Col sm={8}>
                <Form.Control as="select" onChange={(e) => sortChange(e)}>
                { useLocation().pathname.includes('/search') ? <option value="0"> Relevance</option> : null}
                <option value="1">Date created</option>
                <option value="2">Date modified</option>
                <option value="3">Likes</option>
                <option value="4">Comments</option>
                </Form.Control>
                </Col>
            </Form.Group>
            </Col>
        </Row>
        <Row sm={2}>
            {recipeDataFiltered.slice(activePage*recipesPerPage, activePage*recipesPerPage+recipesPerPage).map(generateCard)}
        </Row>
        <Row>
            <Col>
            <Pagination>
                {[...Array(Math.ceil(recipeDataFiltered.length / recipesPerPage)).keys()].map(i => 
                    <Pagination.Item key={i} active={i === activePage} onClick={()=>setActivePage(i)}>{i+1}</Pagination.Item>
                )}
            </Pagination>
            </Col>
        </Row>
        </Col>
        </>);
}

export default RecipeList;