import React, {useEffect, useState} from 'react';
import { Link, useLocation, useHistory, useParams } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Card from "react-bootstrap/Card";

import ReactTimeAgo from "react-time-ago";

import Slider from '@material-ui/core/Slider';

function generateCard(recipe, index) {
    return(
        <div  style={{padding:"1em"}}>
        <Link style={{color:'black'}} to={"/recipe/" + recipe.recipe_id} >
            <Card key={index}>
                <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    <Card.Text>
                        <b> Serving size: </b> {recipe.serving_size} <br />
                        <b> Time to cook:</b> {recipe.time_to_cook} minutes <br />
                        <b> Meal: </b> {recipe.type} <br />
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className={"text-muted"}>
                        {"Created "}
                        <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                        {recipe.edit_time != null ? <>
                        {" | Modified "}
                        <ReactTimeAgo date={new Date(recipe.edit_time)} locale="en-US"/> </>
                        : ""}
                    </small>

                </Card.Footer>
            </Card>
        </Link>
            </div>
    )
}
function RecipeList(props) {

    console.log(props.recipeData);
    const [recipeData, setRecipeData] = useState(props.recipeData);
    const [mealFilters, setMealFilters] = useState(initMealFilters());
    const [activeMealFilter, setActiveMealFilter] = useState([]);

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
        setActiveMealFilter(tempArray, filterRecipes());
    }

    function filterRecipes() {
        let tempArray = Array.from(props.recipeData);
        if (activeMealFilter.length != 0) {
            tempArray = tempArray.filter(function(e) {
                console.log(activeMealFilter.includes(e.type));
                return activeMealFilter.includes(e.type);
            })
        }
        setRecipeData(tempArray);
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
            case "1":
                key = "edit_time"
                break;
            default:
                key = "creation_time";
        }
        let copy = Array.from(props.recipeData);
        copy.sort(sortComparator(key));
        copy.reverse();
        props.setRecipeData(copy);
    }

    useEffect(() => {
        filterRecipes();
    }, [props.recipeData, activeMealFilter])

    return (<>
        <Col sm={3}>
        <Row>
            <h4>Filter</h4><br/>
        </Row>
        <Row style={{marginTop:'1em'}}>
        <h6>Meal type</h6>
        </Row>
        {mealFilters.map((t) => 
            <Row><Form.Check type='checkbox' label={t} onChange={e => toggleMealFilter(t, e.target.checked)}/></Row>
        )}
        <Row style={{marginTop:'1em'}}>
        <h6>Time to cook</h6>
        </Row><Row style={{width: '80%'}}>
        <Col sm={6}>
        <Form.Control size="sm" type="number" placeholder="Min" />
        </Col>
        <Col sm={6}>
        <Form.Control size="sm" type="number" placeholder="Max" />
        </Col>

        </Row>
        <Row style={{width: '80%'}}>
        <Slider value={[20, 80]}/>
        </Row>
        <Row style={{marginTop:'1em'}}>
        <Button size="sm" variant="outline-secondary">Clear all</Button>
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
                <option value="0">Date created</option>
                <option value="1">Date modified</option>
                <option value="2">Likes</option>
                <option value="3">Comments</option>
                </Form.Control>
                </Col>
            </Form.Group>
            </Col>
        </Row>
        <Row sm={2} className="g-2">
            {recipeData.map(generateCard)}
        </Row>
        </Col>
        </>);
}

export default RecipeList;