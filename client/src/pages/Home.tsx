import { Button } from "react-bootstrap";
import "../styles/index.css"

const Home = () => {
    return (
        <div className="page">
            <h1 className="home-heading">
                Quiplash
            </h1>

            <h4 className="home-sub-heading">Clone by Justus</h4>

                <br></br>
            <div className="home-button-container">
                <Button href="/create" className="home-big-button">Create Game</Button>
                <br></br>
                <br></br>
                <Button
                    href="/join"
                    className="home-big-button"
                >
                    Join Game
                </Button>
            </div>
        </div>
    );
};

export default Home;