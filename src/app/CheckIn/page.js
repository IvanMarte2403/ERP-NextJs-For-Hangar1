"use client";
import { useState } from "react";
import Link from 'next/link'; 

import NavBar from "../../components/NavBar"


export default function CheckIn (){


    return(
        <main className="container-home">

            <div className="nav-bar-home">
                <div className="container-image">
                    <img src="img/logo-hangar-1.png" alt="Logo" />
                </div>
                <NavBar />

            </div>
            
            <div className="home-container containerCheckin">
                <div className="car-container">
                    <div className="column">
                        <h3 className="title">Ford Mustang</h3>
                        {/* Kilometros & Verificación */}
                        <div className="info-car">
                            {/* Kilometros */}
                            <div className="row-1">
                                <h3>
                                    Kilometros
                                </h3>
                                <p>
                                    129,200
                                </p>
                            </div>
                            {/* Verificacion */}
                            <div className="row-2">
                                <h3>
                                    Color
                                </h3>
                                <p>
                                    Azul
                                </p>
                            </div>
                        </div>
                        {/* Placa & Año */}
                        <div className="info-car">
                            {/* Placa */}
                            <div className="row-1">
                                <h3>
                                    Placa
                                </h3>
                                <p>
                                    RMS-ASA
                                </p>
                            </div>
                            {/* Verificacion */}
                            <div className="row-2">
                                <h3>
                                    Año
                                </h3>
                                <p>
                                    2012
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="container-toggle">
                            <button>
                                Muscle Car
                                <img
                                src="icons/dropdown.svg"
                                />
                            </button>
                        </div>

                        <div className="container-car">
                            <img
                            src="cars/muscle-car.png"
                            />
                        </div>
                    </div>
                </div>

                <div className="recomendaciones-container">
                    <div className="container-table">
                        {/* Title Table */}
                        <div className="row title-table">
                            <div className="r-1">
                                <p>Recomendaciones</p>
                            </div>
                            <div className="r-2">
                                <p>Estado</p>
                            </div>
                            <div className="r-3">
                                <p>F.Recibido</p>
                            </div>
                            <div className="r-4">
                                <p>F.Final</p>
                            </div>

                            <div className="r-5">

                            </div>
                        </div>

                        <div className="row">
                            <div className="r-1">
                                <p>Llanta delantera izquierda dañada</p>
                            </div>
                            <div className="r-2">
                                <p className="success-recomendaciones">Realizado</p>
                            </div>
                            <div className="r-3">
                                <p>12/05/2024</p>
                            </div>
                            <div className="r-4">
                                <p>12/06/2024</p>
                            </div>

                            <div className="r-5">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </main>
    );
}