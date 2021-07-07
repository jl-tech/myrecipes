import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function DeleteSuccess() {

    return (
        <Modal.Dialog>
            <Modal.Body>
            <div style={{textAlign:"center"}}>
                Recipe deleted successfully <br />
                <Link to="/" component={Button} style={{marginTop:"1em"}}>
                    Return to home
                </Link>
            </div>
            </Modal.Body>
            </Modal.Dialog>
        );

}

export default DeleteSuccess;