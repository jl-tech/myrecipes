import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cookie from 'universal-cookie';
import ReactTimeAgo from "react-time-ago";
import {Link, useHistory} from "react-router-dom";
import Like from "../Like.svg";
import Card from "react-bootstrap/Card";
import Comment from "../comment_black_24dp.svg";

function RecipeViewRecommendations(props) {
    const cookie = new Cookie();
    const [hoveredRecipeId, setHoveredRecipeId] = useState(-1)
    const history = useHistory()

    function generateCard(recipe, index) {
        return(
            <div style={{padding:"1em"}}  key={index}>

                <Card
                      onMouseEnter={() => setHoveredRecipeId(recipe.recipe_id)}
                      onMouseLeave={() => setHoveredRecipeId(-1)}
                      className={hoveredRecipeId === recipe.recipe_id ? 'shadow-lg' : 'shadow-sm'}>
                    <div style={{color:'black', textDecoration: 'none', cursor:'pointer'}} role="link" onClick={()=>{history.push("/recipe/" + recipe.recipe_id);history.go(0);}} >
                        <Card.Img variant="Top" style={{width:"100%", height:"9vw", objectFit:"cover"}} alt="Recipe Image" src={recipe.photo_path == null ? "http://127.0.0.1:5000/img/default_recipe.png" : "http://127.0.0.1:5000/img/" + recipe.photo_path}/>
                        <Card.Body style={{textAlign: "center"}}>
                            <Card.Title className={"text-truncate"}>{recipe.name}</Card.Title>
                            <Card.Text style={{height:"1.5em", textDecoration: 'none'}} className="text-truncate">
                                    {recipe.description == null ? "No description available" : recipe.description}
                            </Card.Text>
                            <div style={{textAlign: "center"}}>
                                <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"1em 0em"}}><tbody>
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
                            <Col sm={2} className={"mx-auto my-auto"} style={{paddingLeft:"0.5em"}}>

                                <Link  to={"/profile/" + recipe.user_id} >
                                    <Image  onClick={(e) => e.stopPropagation()} src={"http://127.0.0.1:5000/img/" + recipe.profile_pic_path} alt="Profile Picture" roundedCircle width="40em"/>
                                </Link>
                            </Col>
                            <Col sm={10}>
                                <Row>
                                    <Col sm={8} style={{paddingLeft:"0"}} className={"text-truncate"}>
                                        <Link  to={"/profile/" + recipe.user_id}>
                                            <div onClick={(e) => e.stopPropagation()}> {recipe.first_name + " " + recipe.last_name} <br/> </div>
                                        </Link>
                                    </Col>
                                    <Col sm={4} style={{textAlign:"right"}}>
                                        <Image src={Like} style={{height:"50%"}}/>
                                        <span style={{fontSize: "110%", verticalAlign: "middle"}}> {recipe.likes} </span>
                                        <Image src={Comment} style={{height:"60%"}} />
                                        <span style={{fontSize: "110%", verticalAlign: "middle"}}> {recipe.comments} </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <small className={"text-muted"}>
                                        {"Created "}
                                        <ReactTimeAgo date={new Date(recipe.creation_time)} locale="en-US"/>
                                        {recipe.edit_time != null ? <>
                                                {" | Modified "}
                                                <ReactTimeAgo date={new Date(recipe.edit_time)} locale="en-US"/> </>
                                            : ""}
                                    </small>
                                </Row>
                            </Col>
                        </Row>
                    </Card.Footer>
                        </div>
                </Card>
            </div>
        )
    }

    return (<>
        {props.recipeData.length > 0 ?
        <Row style={{marginTop:"2em"}}>
            <Col sm={1} />
            <Col>
            <h3>Recommendations</h3>
            <Row sm={3}>
                {props.recipeData.map(generateCard)}
            </Row>

            </Col>
        </Row>
        :null}
        
    </>);
}
                    
export default RecipeViewRecommendations;