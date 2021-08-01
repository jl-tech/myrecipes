/**
 * Component providing nutrition section for the recipe page.
 */

import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import { Spinner, Table } from "react-bootstrap";

/**
 * Performs the API request for /recipe/nutrition and returns the result
 * of that request.
 * @throws The error if the API request was not successful.
 * @param recipe_id - the recipe id to check nutrition of
 * @returns {Promise<*>} The response from the server. null on failure.
 */
async function requestNutrition(recipe_id) {
    let response = await fetch(
        "http://localhost:5000/recipe/nutrition?" +
            new URLSearchParams({ recipe_id: recipe_id }),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    ).catch((e) => {
        throw new Error(e);
    });

    let responseJson = await response.json();

    if (response.ok) return responseJson;
    else throw new Error(responseJson.error);
}

function RecipeViewNutri(props) {
    // The nutrition info dict
    const [nutritionData, setNutritionData] = useState({});
    // Fetch status of nutrition
    const [fetched, setFetched] = useState(false);
    const [success, setSuccess] = useState(false);
    // Whether a failure was incurred by the Nutritionix API
    const [failNutritionix, setFailNutritionix] = useState(false);

    /**
     * Calls and awaits for the nutrition request function and sets the nutrition
     * state based on the response.
     */
    async function processNutrition() {
        let response = await requestNutrition(props.recipeId).catch((e) => {
            setFailNutritionix(true);
        });

        if (response != null) {
            setNutritionData(response);
            setSuccess(true);
        }
        setFetched(true);
    }

    useEffect(() => {
        if (!fetched) processNutrition();
    }, []);

    if (!success) {
        // Did not succeed
        return failNutritionix ? (
            // Did not succeed because of Nutritionix
            <>
                <h5 style={{ textAlign: "center" }}> Nutritional Info </h5>
                <p style={{ textAlign: "center" }}> per serving</p>
                <p style={{ textAlign: "center" }}>
                    Failed to fetch nutrition. Try again later. <br />
                    <small> Is the API limit exceeded? </small>
                </p>
            </>
        ) : (
            // Did not succeed because of our end
            <>
                <h5 style={{ textAlign: "center" }}> Nutritional Info </h5>
                <p style={{ textAlign: "center" }}> per serving</p>
                <div style={{ textAlign: "center" }}>
                    <Spinner
                        style={{ color: "tomato" }}
                        animation={"grow"}
                        size={"sm"}
                    />
                    <br />
                    <small> One sec... </small>
                </div>
                <br />
                <p style={{ textAlign: "center" }}>
                    <small>
                        {" "}
                        powered by{" "}
                        <a href={"http://nutritionix.com"}>
                        <Image
                            style={{ height: "2em", width: "auto" }}
                            src={
                                "https://www.nutritionix.com/nix_assets/images/nutritionix_small.png"
                            }
                        />
                        </a>
                    </small>
                </p>
            </>
        );
    } else {
        // Success
        return (
            <>
                <h5 style={{ textAlign: "center" }}> Nutritional Info </h5>
                <p style={{ textAlign: "center" }}> per serving</p>
                <Row className={"mx-auto align-content-center"}>
                    <Table bordered hover size={"sm"} className={"shadow-sm"}>
                        <tbody>
                            <tr>
                                <th>Calories</th>
                                <td>{nutritionData["calories"]}</td>
                            </tr>
                            <tr>
                                <th>Fat</th>
                                <td>{nutritionData["total_fat"]} g</td>
                            </tr>
                            <tr>
                                <td> &nbsp; Saturated</td>
                                <td>{nutritionData["saturated_fat"]} g</td>
                            </tr>
                            <tr>
                                <th> Cholesterol</th>
                                <td>{nutritionData["cholesterol"]} mg</td>
                            </tr>
                            <tr>
                                <th> Sodium</th>
                                <td>{nutritionData["sodium"]} mg</td>
                            </tr>
                            <tr>
                                <th> Potassium</th>
                                <td>{nutritionData["potassium"]} mg</td>
                            </tr>
                            <tr>
                                <th> Carbohydrates &nbsp;</th>
                                <td>{nutritionData["total_carbohydrate"]} g</td>
                            </tr>
                            <tr>
                                <td> &nbsp; Sugar</td>
                                <td>{nutritionData["sugars"]} g</td>
                            </tr>
                            <tr>
                                <td> &nbsp; Dietary fibre</td>
                                <td>{nutritionData["dietary_fiber"]} g</td>
                            </tr>
                            <tr>
                                <th> Protein</th>
                                <td>{nutritionData["protein"]} g</td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
                <p style={{ textAlign: "center" }}>
                    <small>
                        {" "}
                        powered by{" "}
                        <a href={"http://nutritionix.com"}>
                        <Image
                            style={{ height: "2em", width: "auto" }}
                            src={
                                "https://www.nutritionix.com/nix_assets/images/nutritionix_small.png"
                            }
                        />
                        </a>
                    </small>
                </p>
            </>
        );
    }
}

export default RecipeViewNutri;
