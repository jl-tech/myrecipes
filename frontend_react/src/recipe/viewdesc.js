import React, {useEffect, useState} from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function RecipeViewDesc(props) {

    return (
        <>
            <Row>
                <Col>
                    <div style={{textAlign:"center"}}>
                        <h1>{props.recipeName}</h1>
                    </div>
                </Col>
            </Row>
            <Row style={{textAlign:"center"}}>
                <Col>
                <table style={{marginLeft:"auto", marginRight:"auto", borderCollapse:"separate", borderSpacing:"2em 0em"}}><tbody>
                    <tr>
                        <th style={{fontSize:"200%"}}> {props.time} </th>
                        <th style={{fontSize:"200%"}}> {props.serving} </th>
                        <th style={{fontSize:"200%"}}> {props.mealType} </th>
                    </tr>
                    <tr>
                        <td> MINS </td>
                        <td> SERVES </td>
                        <td> MEAL </td>
                    </tr>
                </tbody></table>
                </Col>
            </Row>
            
        </>
    );
}

export default RecipeViewDesc;