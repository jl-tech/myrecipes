/*
   Reusable component providing a list of recipes in a card format
 */
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";
import Like from "../images/Like.svg";
import Comment from "../images/comment_black_24dp.svg";
import ReactTimeAgo from "react-time-ago";

import Slider from "@material-ui/core/Slider";

function RecipeList(props) {
    // The recipe data as an array of dicts. Pass in as a required prop.
    const [recipeData, setRecipeData] = useState(props.recipeData);

    // Filtering state
    const [recipeDataFiltered, setRecipeDataFiltered] = useState(
        props.recipeData
    );
    const [mealFilters, setMealFilters] = useState(initMealFilters());
    const [activeMealFilter, setActiveMealFilter] = useState([]);
    const [servingFilters, setServingFilters] = useState(initServingFilters());
    const [activeServingFilters, setActiveServingFilters] = useState([
        Math.min(...servingFilters),
        Math.max(...servingFilters),
    ]);
    const [timeFilters, setTimeFilters] = useState(initTimeFilters());
    const [activeTimeFilters, setActiveTimeFilters] = useState([
        Math.min(...timeFilters),
        Math.max(...timeFilters),
    ]);
    const [calorieFilters, setCalorieFilters] = useState(initCalorieFilters());
    const [activeCalorieFilters, setActiveCalorieFilters] = useState([
        Math.min(...calorieFilters),
        Math.max(...calorieFilters),
    ]);

    // Active page state
    const [activePage, setActivePage] = useState(0);
    // State to support shadow effect on hover
    const [hoveredRecipeId, setHoveredRecipeId] = useState(-1);
    // Some features of this component differ when on a search page
    const isSearchPage = useLocation().pathname.includes("/search");
    // Adjust to increase/decrease number of recipes per page
    const recipesPerPage = 4;
    const history = useHistory();

    /**
     * Generates each recipe card. Should be used in a map.
     * @param recipe - the details of the recipe as a dict
     * @param index - the index of the card
     * @return the card as a react fragment
     */
    function generateCard(recipe, index) {
        return (
            <div style={{ padding: "1em" }} key={index}>
                <Card
                    onMouseEnter={() => setHoveredRecipeId(recipe.recipe_id)}
                    onMouseLeave={() => setHoveredRecipeId(-1)}
                    className={
                        hoveredRecipeId === recipe.recipe_id
                            ? "shadow-lg"
                            : "shadow-sm"
                    }
                >
                    <div
                        style={{
                            color: "black",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                        role="link"
                        onClick={() =>
                            history.push("/recipe/" + recipe.recipe_id)
                        }
                    >
                        <Card.Img
                            variant="Top"
                            style={{
                                width: "100%",
                                height: "9vw",
                                objectFit: "cover",
                            }}
                            alt="Recipe Image"
                            src={
                                recipe.photo_path == null
                                    ? "http://127.0.0.1:5000/img/default_recipe.png"
                                    : "http://127.0.0.1:5000/img/" +
                                      recipe.photo_path
                            }
                        />
                        <Card.Body style={{ textAlign: "center" }}>
                            <Card.Title className={"text-truncate"}>
                                {recipe.name}
                            </Card.Title>
                            <Card.Text
                                style={{
                                    height: "1.5em",
                                    textDecoration: "none",
                                }}
                                className="text-truncate"
                            >
                                {recipe.description == null
                                    ? "No description available"
                                    : recipe.description}
                            </Card.Text>
                            <div style={{ textAlign: "center" }}>
                                <table
                                    style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        borderCollapse: "separate",
                                        borderSpacing: "1em 0em",
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            <th style={{ fontSize: "95%" }}>
                                                {" "}
                                                {recipe.time_to_cook}{" "}
                                            </th>
                                            <th style={{ fontSize: "95%" }}>
                                                {" "}
                                                {recipe.serving_size}{" "}
                                            </th>
                                            <th style={{ fontSize: "95%" }}>
                                                {" "}
                                                {recipe.type}{" "}
                                            </th>
                                            <th style={{ fontSize: "95%" }}>
                                                {" "}
                                                {recipe.calories == null
                                                    ? "N/A"
                                                    : recipe.calories}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: "80%" }}>
                                                {" "}
                                                MINS
                                            </td>
                                            <td style={{ fontSize: "80%" }}>
                                                {" "}
                                                SERVES
                                            </td>
                                            <td style={{ fontSize: "80%" }}>
                                                {" "}
                                                MEAL
                                            </td>
                                            <td style={{ fontSize: "80%" }}>
                                                {" "}
                                                CAL
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>

                        <Card.Footer className={"text-truncate"}>
                            <Row>
                                <Col
                                    sm={2}
                                    className={"mx-auto my-auto"}
                                    style={{ paddingLeft: "0.5em" }}
                                >
                                    <Link to={"/profile/" + recipe.user_id}>
                                        <Image
                                            onClick={(e) => e.stopPropagation()}
                                            src={
                                                "http://127.0.0.1:5000/img/" +
                                                recipe.profile_pic_path
                                            }
                                            alt="Profile Picture"
                                            roundedCircle
                                            width="40em"
                                            height="40em"
                                            style={{objectFit: "cover"}}
                                        />
                                    </Link>
                                </Col>
                                <Col sm={10}>
                                    <Row>
                                        <Col
                                            sm={8}
                                            style={{ paddingLeft: "0em" }}
                                            className={"text-truncate"}
                                        >
                                            <Link
                                                to={
                                                    "/profile/" + recipe.user_id
                                                }
                                            >
                                                <div
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    {" "}
                                                    {recipe.first_name +
                                                        " " +
                                                        recipe.last_name}
                                                    <br />
                                                </div>
                                            </Link>
                                        </Col>
                                        <Col
                                            sm={4}
                                            style={{ textAlign: "right" }}
                                        >
                                            <Image
                                                src={Like}
                                                style={{ height: "50%" }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "110%",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {" "}
                                                {recipe.likes}{" "}
                                            </span>
                                            <Image
                                                src={Comment}
                                                style={{ height: "60%" }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "110%",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {" "}
                                                {recipe.comments}{" "}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <small className={"text-muted"}>
                                            {"Created "}
                                            <ReactTimeAgo
                                                date={
                                                    new Date(
                                                        recipe.creation_time
                                                    )
                                                }
                                                locale="en-US"
                                            />
                                            {recipe.edit_time != null ? (
                                                <>
                                                    {" | Modified "}
                                                    <ReactTimeAgo
                                                        date={
                                                            new Date(
                                                                recipe.edit_time
                                                            )
                                                        }
                                                        locale="en-US"
                                                    />{" "}
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </small>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </div>
                </Card>
            </div>
        );
    }

    /**
     * Initialises the meal filters.
     * @returns {any[]}
     */
    function initMealFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.type);
        }
        let mealTypes = ["Breakfast", "Brunch", "Lunch", "Dinner", "Snack"];
        return Array.from(tempSet).sort(function (a, b) {
            return mealTypes.indexOf(a) - mealTypes.indexOf(b);
        });
    }

    /**
     * Toggles the meal filter specified on/off
     * @param type the type of meal
     * @param checked whether that filter is currently checked (on/off)
     * @returns {any[]}
     */
    function toggleMealFilter(type, checked) {
        let tempArray = Array.from(activeMealFilter);
        if (checked) {
            tempArray.push(type);
        } else {
            tempArray.splice(tempArray.indexOf(type), 1);
        }
        setActiveMealFilter(tempArray);
    }

    /**
     * Initialises the serving filters.
     * @returns {any[]}
     */
    function initServingFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.serving_size);
        }
        return Array.from(tempSet).sort();
    }

    /**
     * Initialises the time to cook filters.
     * @returns {any[]}
     */
    function initTimeFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.time_to_cook);
        }
        return Array.from(tempSet).sort();
    }

    /**
     * Initialises the calorie filters.
     * @returns {any[]}
     */
    function initCalorieFilters() {
        let tempSet = new Set();
        for (let i of props.recipeData) {
            tempSet.add(i.calories);
        }
        return Array.from(tempSet).sort();
    }

    /**
     * Filters the recipes in the list based on the state of the filter hooks.
     * @returns {any[]}
     */
    function filterRecipes() {
        let tempArray = Array.from(recipeData);
        if (activeMealFilter.length !== 0) {
            tempArray = tempArray.filter(function (e) {
                return activeMealFilter.includes(e.type);
            });
        }
        tempArray = tempArray.filter(function (e) {
            return (
                e.serving_size >= activeServingFilters[0] &&
                e.serving_size <= activeServingFilters[1]
            );
        });
        tempArray = tempArray.filter(function (e) {
            return (
                e.time_to_cook >= activeTimeFilters[0] &&
                e.time_to_cook <= activeTimeFilters[1]
            );
        });
        tempArray = tempArray.filter(function (e) {
            return (
                e.calories >= activeCalorieFilters[0] &&
                e.calories <= activeCalorieFilters[1]
            );
        });
        setRecipeDataFiltered(tempArray);
        if (activePage > Math.ceil(tempArray.length / recipesPerPage) - 1) {
            setActivePage(Math.ceil(tempArray.length / recipesPerPage) - 1);
        } else if (activePage < 0) {
            setActivePage(0);
        }
    }

    /**
     * Clears all filters, i.e. sets the filter hooks to default.
     */
    function clearFilters() {
        setActiveMealFilter([]);
        setActiveServingFilters([
            Math.min(...servingFilters),
            Math.max(...servingFilters),
        ]);
        setActiveTimeFilters([
            Math.min(...timeFilters),
            Math.max(...timeFilters),
        ]);
        setActiveCalorieFilters([
            Math.min(...calorieFilters),
            Math.max(...calorieFilters),
        ]);
        let checkboxes = document.getElementsByClassName("form-check-input");
        for (let checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }

    /**
     * Comparator function which sorts based on the given key
     * @param key - the key to sort with, must be 'creation_time', 'edit_time'
     * or other for a simple ordered sorting.
     */
    function sortComparator(key) {
        return function (a, b) {
            switch (key) {
                case "creation_time": {
                    let aDate = Date.parse(a[key]);
                    let bDate = Date.parse(b[key]);
                    if (aDate > bDate) return 1;
                    else if (aDate < bDate) return -1;
                    return 0;
                }
                case "edit_time": {
                    let aDate =
                        a[key] == null
                            ? Date.parse(a["creation_time"])
                            : Date.parse(a[key]);
                    let bDate =
                        b[key] == null
                            ? Date.parse(b["creation_time"])
                            : Date.parse(b[key]);
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
        };
    }

    /**
     * Handles the event where sorting is changed
     * @param e: the onChange event
     */
    function sortChange(e) {
        let key = "creation_time";
        switch (e.target.value) {
            case "1":
                key = "creation_time";
                break;
            case "2":
                key = "edit_time";
                break;
            case "3":
                key = "likes";
                break;
            case "4":
                key = "comments";
                break;
            default:
                setRecipeData(props.recipeData);
                return;
        }
        let copy = Array.from(props.recipeData);
        copy.sort(sortComparator(key));
        copy.reverse();
        setRecipeData(copy);
    }

    useEffect(() => {
        filterRecipes();
    }, [
        recipeData,
        activeMealFilter,
        activeServingFilters,
        activeTimeFilters,
        activeCalorieFilters,
    ]);

    if (recipeData.length !== 0) {
        return (
            <>
                <Col sm={3}>
                    <Row>
                        <h4>Filter</h4>
                        <br />
                    </Row>
                    <Row style={{ marginTop: "1em" }}>
                        <h6>Meal type</h6>
                    </Row>
                    {mealFilters.map((t, index) => (
                        <Row key={index}>
                            <Form.Check
                                type="checkbox"
                                label={t}
                                onChange={(e) =>
                                    toggleMealFilter(t, e.target.checked)
                                }
                            />
                        </Row>
                    ))}
                    <Row style={{ marginTop: "1em" }}>
                        <h6>Serving Size</h6>
                    </Row>
                    <Row style={{ width: "80%", marginTop: "2em" }}>
                        <Slider
                            style={{ color: "tomato" }}
                            value={activeServingFilters}
                            min={Math.min(...servingFilters)}
                            max={Math.max(...servingFilters)}
                            valueLabelDisplay="on"
                            onChange={(e, v) => setActiveServingFilters(v)}
                        />
                    </Row>
                    <Row style={{ marginTop: "1em" }}>
                        <h6>Time to cook</h6>
                    </Row>
                    <Row style={{ width: "80%", marginTop: "2em" }}>
                        <Slider
                            style={{ color: "tomato" }}
                            value={activeTimeFilters}
                            min={Math.min(...timeFilters)}
                            max={Math.max(...timeFilters)}
                            valueLabelDisplay="on"
                            onChange={(e, v) => setActiveTimeFilters(v)}
                        />
                    </Row>
                    <Row style={{ marginTop: "1em" }}>
                        <h6>Calories</h6>
                    </Row>
                    <Row style={{ width: "80%", marginTop: "2em" }}>
                        <Slider
                            style={{ color: "tomato" }}
                            value={activeCalorieFilters}
                            min={Math.min(...calorieFilters)}
                            max={Math.max(...calorieFilters)}
                            valueLabelDisplay="on"
                            onChange={(e, v) => setActiveCalorieFilters(v)}
                        />
                    </Row>
                    <Row style={{ marginTop: "1em" }}>
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={clearFilters}
                        >
                            Clear all
                        </Button>
                    </Row>
                </Col>
                <Col sm={9}>
                    <Row>
                        <Col sm={7} />
                        <Col sm={5}>
                            <Form.Group as={Row}>
                                <Form.Label column sm={4}>
                                    Sort by:
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        as="select"
                                        onChange={(e) => sortChange(e)}
                                    >
                                        {isSearchPage ? (
                                            <option value="0">
                                                {" "}
                                                Relevance
                                            </option>
                                        ) : null}
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
                        {recipeDataFiltered
                            .slice(
                                activePage * recipesPerPage,
                                activePage * recipesPerPage + recipesPerPage
                            )
                            .map(generateCard)}
                    </Row>
                    <Row>
                        <Col>
                            <Pagination>
                                {[
                                    ...Array(
                                        Math.ceil(
                                            recipeDataFiltered.length /
                                                recipesPerPage
                                        )
                                    ).keys(),
                                ].map((i) => (
                                    <Pagination.Item
                                        key={i}
                                        active={i === activePage}
                                        onClick={() => setActivePage(i)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        </Col>
                    </Row>
                </Col>
            </>
        );
    } else {
        return (
            <>
                <div style={{ textAlign: "center", width: "100%" }}>
                    <h4> Nothing to show</h4>
                </div>
            </>
        );
    }
}

export default RecipeList;
