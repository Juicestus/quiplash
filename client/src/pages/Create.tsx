import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { StringObject, queryBackend } from "../net";
import { bindInput } from "../net";
import { NavLink } from "react-router-dom";

const Create = () => {
  const [name, setName] = useState("");
//   let [roundLength, setRoundLength] = useState(60); // unimplemented

  const navigate = useNavigate();

  const submitHandler = (event: any) => { // todo: fix explicit any
    event.preventDefault();

    queryBackend(
      "createNewGame",
      {
        hostName: name,
      },
      (response: StringObject) => {

        sessionStorage.setItem("playerName", response.name ?? "ERROR");
        sessionStorage.setItem("gameCode", response.code ?? "DEAD");

        navigate("/game/lobby/" + response.code);
      }
    );
  };

  return (
    <div className="page">
      <div>
        <h2 className="create-join-back">
          <NavLink to="/">{"←"}</NavLink>
        </h2>
        <h1 className="create-join-heading">Create a Game.</h1>
      </div>
      <div className="create-join-big-container">
        <h4 className="create-join-label">Your name.</h4>
        <br />
        <input
          type="text"
          id="name"
          name="name"
          placeholder=""
          className="create-join-big-input-box"
          onChange={bindInput(setName)}
        />


        {/* ROUND LENGTH SETTER -- MAYBE IMPLEMENT LATER */}
        {/* <div className="create-set-round-length">
          <h4 className="create-join-label">Round Length.</h4>

          <div className="create-round-length-setter">
            <input
              type="button"
              value="-"
              className="btn btn-danger create-join-button"
              onClick={(e: any) => {
                e.preventDefault();
                setRoundLength(Math.max(0, --roundLength));
              }}
            />

            <input
              type="text"
              className="create-join-med-input-box"
              onChange={bindInput(setRoundLength)}
              value={roundLength}
            />

            <input
              type="button"
              value="+"
              className="btn btn-success create-join-button"
              onClick={(e: any) => {
                e.preventDefault();
                setRoundLength(++roundLength);
              }}
            />
          </div>
        </div> */}

        <Button className="create-join-big-button" onClick={submitHandler}>
          Create Game
        </Button>
      </div>
    </div>
  );
};

export default Create;