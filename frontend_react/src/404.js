import React from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "./images/WIP_logo_2.png";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function NotFound(props) {
    const history = useHistory();
    return (
        <>
            <Helmet>
                <title> 404 Not Found - MyRecipes </title>
            </Helmet>
            <div style={{ textAlign: "center", marginTop: "1em" }}>
                <img src={logo} alt="Logo" style={{ maxWidth: "500px" }} />
            </div>
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>404 Not Found</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> The page you were looking for wasn't found. </p>
                    <Button onClick={() => history.push("/home")}>
                        {" "}
                        Go home{" "}
                    </Button>
                </Modal.Body>
            </Modal.Dialog>
        </>
    );
}

export default NotFound;
