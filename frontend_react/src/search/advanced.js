import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchAdvanced(props) {
    const history = useHistory()
    let query = useQuery();
    const [name, setName] = useState(query.get('name'));
    const [serving, setServing] = useState(query.get('serving'));
    const [time, setTime] = useState(query.get('time'));
    const [meal, setMeal] = useState(validateType());
    const [ingredient, setIngredient] = useState(query.get('ingredient'));
    const [step, setStep] = useState(query.get('step'));
    
    function validateType() {
        let type = query.get('type');
        let validTypes = ["", "Breakfast", "Brunch", "Lunch", "Dinner", "Snack"];
        return validTypes.includes(type) ? type : "";
    }

    function handleSubmit(event) {
        event.preventDefault()
        let url = '';
        if (name != null) {
            if (name.trim() !== "") {
                url = url + "name=" + name + "&";
            }
        }
        if (serving != null) {
            if (serving.trim() !== "") {
                url = url + "serving=" + serving + "&";
            }
        }
        if (time != null) {
            if (time.trim() !== "") {
                url = url + "time=" + time + "&";
            }
        }
        if (meal != null) {
            if (meal.trim() !== "") {
                url = url + "type=" + meal + "&";
            }
        }
        if (ingredient != null) {
            if (ingredient.trim() !== "") {
                url = url + "ingredient=" + ingredient + "&";
            }
        }
        if (step != null) {
            if (step.trim() !== "") {
                url = url + "step=" + step + "&";
            }
        }
        if (url !== '') {
            history.push(`/search?${url}`)
            history.go();
        } else {
            props.setErrorShow(true);
        }
    }

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Name</Form.Label>
                    <Col sm="9">
                        <Form.Control defaultValue={name} onChange={e => setName(e.target.value)}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Serving size</Form.Label>
                    <Col sm="9">
                        <Form.Control defaultValue={serving} type="number" onChange={e => setServing(e.target.value)}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Time to cook</Form.Label>
                    <Col sm="9">
                        <Form.Control defaultValue={serving} type="number" onChange={e => setTime(e.target.value)}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Meal type</Form.Label>
                    <Col sm="9">
                    <Form.Control as="select" onChange={e => setMeal(e.target.value)} defaultValue={meal}>
                        <option></option>
                        <option>Breakfast</option>
                        <option>Brunch</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                    </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Ingredients</Form.Label>
                    <Col sm="9">
                        <Form.Control defaultValue={ingredient}  onChange={e => setIngredient(e.target.value)}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm="3">Step keywords</Form.Label>
                    <Col sm="9">
                        <Form.Control defaultValue={step}  onChange={e => setStep(e.target.value)}/>
                    </Col>
                </Form.Group>
                <Row>
                    <Col style={{textAlign:"right"}}>
                        <Button type="submit">
                            Search
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default SearchAdvanced;