import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [musicians, setMusicians] = useState([]);

    const fetchMusicians = () => {
        fetch("http://localhost:3030/api")
            .then((response) => response.json())
            .then((response) => setMusicians(response));
    };

    useEffect(() => {
        fetchMusicians();
        const timer = setInterval(fetchMusicians, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="container mt-4">
            <h1>Liste des musiciens actifs</h1>
            <hr />
            {musicians.length === 0 && (
                <h4 className="font-italic text-center">
                    Pas de musicien actif
                </h4>
            )}
            <div className="row">
                {musicians.map((m, index) => {
                    return (
                        <div key={index} className="col-sm-3">
                            <div className="card">
                                <h5 className="card-header">
                                    Musicien N°{index + 1}
                                </h5>
                                <div className="card-body">
                                    <h5 className="card-title text-capitalize">
                                        Instrument: {m.instrument}
                                    </h5>
                                    <p className="card-text">
                                        Joue du {m.instrument} depuis{" "}
                                        {new Date(
                                            m.activeSince
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;
