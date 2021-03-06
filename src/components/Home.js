import React, { useState, useEffect } from 'react';

export default function Home({ URL }) {
    // Luodaan muutujat
    const [games, setGames] = useState([]);
    const [newGameName, setNewGameName] = useState('');
    const [newGM, setNewGM] = useState('');
    const [gameEdited, setGameEdited] = useState(null);
    const [gameNameUptd, setGameNameUptd] = useState('');
    const [gmUpdated, setGmUpdated] = useState('');
    const [characters, setCharacters] = useState([]);
    const [characterPicked, setCharacterPicked] = useState(null);
    const [newCharName, setNewCharName] = useState('');
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newGameNbr, setNewGameNbr] = useState(null);
    const [charEdited, setCharEdited] = useState(null);
    const [charUpdated, setCharUpdated] = useState('');
    const [playerUpdated, setPlayerUpdated] = useState('');
    const [charstatus, setCharstatus] = useState([]);
    const [createDate, setCreateDate] = useState('');
    const [newstatus, setNewStatus] = useState('Elossa');
    const [editStatus, setEditStatus] = useState(null);
    const [editedDate, setEditedDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [today, setToday] = useState('');

    function formatDate(today) {
        let dd = today.getDate();
        let mm = today.getMonth()+1; 
        let yyyy = today.getFullYear();
        if(dd<10) {
            dd='0'+dd;
        } 
        if(mm<10) {
            mm='0'+mm;
        } 
        return yyyy + '-' + mm + '-' + dd;
    }
    // Haetaan peli-taulusta kierrossa olevat pelit
    useEffect(() => {
        const date = new Date();
        const today = formatDate(date);
        setCreateDate(today);
        setToday(today);
        
        let status = 0;
        fetch(URL + 'index.php')
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setGames(res)
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }, [URL, newGameName, newGM])

    // Tallennetaan uusi peli
    function saveNewGame(e) {
        if (newGameName === '' || newGM === '') {
            alert('Sy??t?? uuden pelin nimi ja pelinjohtaja!');
            return;
        }
        e.preventDefault();
        let status = 0;
        fetch(URL + 'new_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelin_nimi: newGameName,
                pelinjohtaja: newGM
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setGames(newGame => [...newGame, res]);
                        Characters(res.pelinro)
                        setNewGameName('');
                        setNewGM('');

                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // poistetaan peli taulusta peli
    function deleteGame(id) {
        let status = 0;
        fetch(URL + 'delete_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelinro: id
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const gamesWithoutRemoved = games.filter((game) => game.pelinro !== id);
                        setGames(gamesWithoutRemoved);
                    } else {
                        if (res.error === 'SQLSTATE[23000]: Integrity constraint violation: 1451 Cannot delete or update a parent row: a foreign key constraint fails (`roolipelit`.`hahmo`, CONSTRAINT `hahmo_fk` FOREIGN KEY (`pelinro`) REFERENCES `peli` (`pelinro`))') {
                            alert('Et voi poistaa peli??, jolla on pelaajahahmoja!')
                        } else {
                            alert(res.error)
                        }
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // Tuodaan sivulla n??kyville pelin tietojen muokkausinputit ja asetetaan muutujille oletusarvot
    function editGame(game) {
        setGameEdited(game);
        setGameNameUptd(game.pelin_nimi);
        setGmUpdated(game.pelinjohtaja);
    }
    // P??ivitet????n pelin tiedot ja piilotetaan muokkausikkuna
    function updateGame(pelinro) {
        let status = 0;
        fetch(URL + 'update_game.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelin_nimi: gameNameUptd,
                pelinjohtaja: gmUpdated,
                pelinro: pelinro,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        games[(games.findIndex(game => game.pelinro === pelinro))].pelin_nimi = gameNameUptd;
                        games[(games.findIndex(game => game.pelinro === pelinro))].pelinjohtaja = gmUpdated;
                        setGameEdited(null);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }

    // tuodaan rietokannasta tiettyyn peliin tehdyt hahmot
    function Characters(pelinro) {
        setCharacterPicked(pelinro);
        setCharstatus([]);
        let status = 0;
        fetch(URL + 'characters.php?pelinro=' + pelinro)
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharacters(res)
                        /* setTrnro(id) */
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // lis??t????n uusi hahmo tiettyyn peliin ja funktion sis??ll?? tehd????n my??s lis??ys kyseisen hahmon statukseen
    function saveNewCharacter(e) {
        e.preventDefault();

        if (newCharName === '' || newPlayerName === '' || createDate === '') {
            alert('Lis???? hahmon ja pelaajan nimet!');
            return;
        } else if (newGameNbr === null) {
            alert('Valitse peli!');
            return;
        }

        let status = 0;

        fetch(URL + 'new_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                pelinro: newGameNbr,
                pelaaja_nimi: newPlayerName,
                hahmon_nimi: newCharName,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        saveStatus(res.hahmonro)
                        setCharacters(newCharacter => [...newCharacter, res]);
                        setNewPlayerName('');
                        setNewCharName('');
                        Characters(newGameNbr);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    // Poistetaan hahmo ja funktion alussa poistetaan my??s hahmoon liittyv?? status
    function deleteCharacter(hahmonro) {
        deleteStatus(hahmonro);
        let status = 0;
        fetch(URL + 'delete_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmonro: hahmonro
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const charWithoutRemoved = characters.filter((char) => char.hahmonro !== hahmonro);
                        setCharacters(charWithoutRemoved);
                        Status(hahmonro);
                    } else {
                        alert(res.error)
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }
    // TUodaan esille hahmonmuokkauksen inputit ja asetetaan oletusarvot
    function editCharacter(game) {
        setCharEdited(game);
        setCharUpdated(game.hahmon_nimi);
        setPlayerUpdated(game.pelaaja_nimi);
    }
    // P??ivitet????n hahmon tiedot ja suljetaan muokkausikkuna 
    function updateCharacter(hahmonro) {
        let status = 0;
        fetch(URL + 'update_character.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmon_nimi: charUpdated,
                pelaaja_nimi: playerUpdated,
                hahmonro: hahmonro,
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        characters[(characters.findIndex(char => char.hahmonro === hahmonro))].hahmon_nimi = charUpdated;
                        characters[(characters.findIndex(char => char.hahmonro === hahmonro))].pelaaja_nimi = playerUpdated;
                        setCharEdited(null);
                        Status(hahmonro);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    // Haetaan hahmoon liittyv?? status esille
    function Status(hahmonro) {
        setEditStatus(null);
        let status = 0;
        fetch(URL + 'status.php?hahmonro=' + hahmonro)
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharstatus(res)

                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // Tallennetaan uusi, lis??tty status
    function saveStatus(hahmonro) {
        let status = 0;
        fetch(URL + 'new_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                luontipvm: createDate,
                hahmonro: hahmonro,
                tila: newstatus,
                hahmon_nimi: newCharName
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        setCharstatus(newCharstatus => [...newCharstatus, res]);
                        setCreateDate('');
                        Status(hahmonro);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }

    // Poistetaan hahmon status. Poito tapahtuu hahmon poiston yhteydess??.
    function deleteStatus(hahmonro) {
        let status = 0;
        fetch(URL + 'delete_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                hahmonro: hahmonro
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        const statusWithoutRemoved = charstatus.filter((status) => status.hahmonro !== hahmonro);
                        setCharstatus(statusWithoutRemoved);
                    } else {
                        alert(res.error)
                    }
                }, (error) => {
                    alert(error)
                }
            )
    }

    // avataan editointi_ikkuna statuyksen muokkaamiselle sek?? asetetaan oletusarvot
    function EditStat(charstatus) {
        setEditStatus(charstatus);
        setEditedDate(charstatus.luontipvm);
        setUpdateStatus(charstatus.tila);
        setEndDate(charstatus.kuolinpvm);
        if (endDate === '') {
            setEndDate(today);
        }

    }
    // Tallennetaan muokattu status
    function SaveStatusUpdate(hahmonro) {
        if (updateStatus === 'Kuollut' && endDate === null) {
            alert('Valitse hahmon kuolinp??iv??.')
            return;
        } else if (endDate !== null && updateStatus === 'Elossa') {
            alert('Muuta hahmon status kuolleeksi')
            return;
        }
        let status = 0;
        fetch(URL + 'update_status.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                luontipvm: editedDate,
                kuolinpvm: endDate,
                hahmonro: hahmonro,
                tila: updateStatus
            })
        })
            .then(res => {
                status = parseInt(res.status);
                return res.json()
            })
            .then(
                (res) => {
                    if (status === 200) {
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].luontipvm = editedDate;
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].kuolinpvm = endDate;
                        charstatus[(charstatus.findIndex(status => status.hahmonro === hahmonro))].tila = updateStatus;
                        setNewStatus('Elossa');
                        setEditStatus(null);
                    } else {
                        alert(res.error);
                    }
                }, (error) => {
                    alert(error);
                }
            )
    }
    return (
        <div className="row">
            <h1>Peliporukan roolipelit:</h1>
            <div>
                <p>T??ll?? sivustolla n??et mit?? roolipelej?? peliporukalla on pelauksessa, sek?? mit?? hahmoja eri peleill?? on ja mik?? on hahmojen status. Voit lis??ksi lis??t?? uusia pelej?? ja hahmoja, sek?? muokata niit?? sek?? hahmojen statusta. </p>
            </div>
            <div>
                <div className="row">
                    <div className="col-md-6 ">
                        <h5 className="mt-2">Lis???? uusi peli:</h5>
                        <p> Voit lis??t?? uusia pelej?? sek?? muokata pelien nimi?? ja niille asetettua pelinjohtajaa. Pelej?? voi my??skin poistaa, jos niille ei ole lis??tty yht????n pelaajahahmoa.
                        Klikkaamalla Hahmot-nappia, n??et mit?? pelaajahahmoja on kyseiselle pelille lis??tty ja ketk?? niit?? pelaavat.
                        </p>
                        <input id="uusiNimi" type="text" maxLength='100' className="form-control m-2" aria-describedby="uusiNimi" placeholder="Sy??t?? uuden pelin nimi" value={newGameName} onChange={e => setNewGameName(e.target.value)} />
                        <input id="uusiPJ" type="text" maxLength='100' className="form-control m-2" aria-describedby="UusiPJ" placeholder="Sy??t?? uuden pelin pelinjohtaja" value={newGM} onChange={e => setNewGM(e.target.value)} />
                        <span className="p-2"><button onClick={saveNewGame} className="btn btn-secondary mt-2">Tallenna</button></span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <h5 className="mt-2">Lis???? uusi hahmo: </h5>
                        <p>Voit lis??t?? uusia hahmoja eri peleille, sek?? muokata hahmon nime?? sek?? pelaajan nime??. Klikkaamalla N??yt?? status-nappia saat kyseisen hahmon statuksen n??kyville. Hahmon voi my??s poistaa kokonaan, jolloin my??s hahmon status poistuu.</p>
                        <form action="submit" onSubmit={saveNewCharacter}>
                            <input placeholder="Sy??t?? uuden hahmon nimi" maxLength='100' className="form-control mt-2" id="hahmonimi" type="text" value={newCharName} onChange={e => setNewCharName(e.target.value)} />
                            <input placeholder="Sy??t?? pelaajan nimi" maxLength='100' className="form-control mt-2" id="pelaajanimi" type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} />
                            <input type="date" className="form-control mt-2" selected={createDate} aria-describedby="muokattupvm" value={createDate} onChange={e => setCreateDate(e.target.value)} />
                            <div className="input-group">
                            </div>
                            <div className="input-group">
                                <select className="form-control mt-2" id="inputGroupSelect01" onChange={e => setNewGameNbr(e.target.value)}>
                                    <label htmlFor="peli">Peli: </label>
                                    <option selected>Valitse Peli</option>
                                    {games.map(game => (
                                        <option value={game.pelinro}>{game.pelin_nimi}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-secondary m-2">Lis????</button>
                        </form>
                    </div>

                </div>

                <div className="col-auto mt-2">

                    <table className="table">
                        <thead>
                            <th scope="col">Pelin nimi</th>
                            <th scope="col">Pelinjohtaja</th>
                        </thead>
                        <tbody>
                            {games.map(game => (
                                <tr>
                                    <td>{game.pelin_nimi}</td>
                                    <td>{game.pelinjohtaja}</td>
                                    <td><button onClick={() => editGame(game)} className="btn btn-secondary">Muokkaa</button></td>
                                    <td><button onClick={() => deleteGame(game.pelinro)} className="btn btn-secondary">Poista</button></td>
                                    <td><button onClick={() => Characters(game.pelinro)} className="btn btn-secondary">Hahmot</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {gameEdited !== null && (
                    <>
                        <h5>Muokkaa Peli??:</h5>
                        <input type="text" className="form-control m-2" maxLength='100' aria-describedby="pelinimi" value={gameNameUptd} onChange={e => setGameNameUptd(e.target.value)} />
                        <input type="text" className="form-control m-2" maxLength='100' aria-describedby="gmnimi" value={gmUpdated} onChange={e => setGmUpdated(e.target.value)} />
                        <span className="p-2"><button onClick={() => updateGame(gameEdited.pelinro)} className="btn btn-secondary">Tallenna</button></span>
                        <button onClick={() => setGameEdited(null)} className="btn btn-secondary">Sulje muokkaamatta</button>
                    </>
                )}
                <div>
                {characterPicked != null && (
                    <>
                        <table className="table mt-3">

                            <thead>
                                <th scope="col">Hahmon nimi</th>
                                <th scope="col">Pelaajan nimi</th>
                            </thead>
                            <tbody>
                                {characters.map(character => (
                                    <tr>
                                        <td>{character.hahmon_nimi}</td>
                                        <td>{character.pelaaja_nimi}</td>
                                        <td><button onClick={() => editCharacter(character)} className="btn btn-secondary">Muokkaa</button></td>
                                        <td><button onClick={() => deleteCharacter(character.hahmonro)} className="btn btn-secondary">Poista</button></td>
                                        <td><button onClick={() => Status(character.hahmonro)} className="btn btn-secondary">Status</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
                </div>
                <div>

                {characterPicked != null && (
                    <>
                        <button className="btn btn-secondary" onClick={() => setCharacterPicked(null)}>Sulje lista</button>
                    </>
                )}

                {charEdited != null && (
                    <>
                        <h5>Muokkaa Hahmoa:</h5>
                        <input type="text" className="form-control m-2" maxLength='100' aria-describedby="uushahmonimi" value={charUpdated} onChange={e => setCharUpdated(e.target.value)} />
                        <input type="text" className="form-control m-2" maxLength='100' aria-describedby="uuspelajanimi" value={playerUpdated} onChange={e => setPlayerUpdated(e.target.value)} />
                        <span className="p-2"><button onClick={() => updateCharacter(charEdited.hahmonro)} className="btn btn-secondary">Tallenna</button></span>
                        <button onClick={() => setCharEdited(null)} className="btn btn-secondary">Sulje muokkaamatta</button>
                    </>
                )}
                </div>
                <div className="mt-2 mb-2">
                    {characterPicked != null && (
                        <>
                            <h5>Hahmon status:</h5>
                            <p>T??ss?? n??et valitun hahmon statuksen. Voit muokata hahmon luontip??iv??nm????r???? ja statuksen kuolleeksi. T??ll??in on lis??tt??v?? my??s hahmon kuolinp??iv??nm????r??. Status poistuu samalla kuin kyseess??oleva hahmo poistetaan.</p>
                            <table className="table">
                                <thead>
                                    <th scope="col">Hahmon nimi:</th>
                                    <th scope="col">Luontip??iv??:</th>
                                    <th scope="col">Tila</th>
                                    <th scope="col">Kuolinp??iv??</th>
                                </thead>
                                <tbody>
                                    {charstatus.map(charstatus => (
                                        <tr>
                                            <td>{charstatus.hahmon_nimi}</td>
                                            <td>{charstatus.luontipvm}</td>
                                            <td>{charstatus.tila}</td>
                                            <td>{charstatus.kuolinpvm}</td>
                                            <td><button onClick={() => EditStat(charstatus)} className="btn btn-secondary">Muokkaa</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                </div >
                {editStatus != null && (
                    <>
                        <div className="mb-2" >
                            <h5>Muokkaa hahmon statusta:</h5>
                            <input type="date" className="form-control m-2" aria-describedby="uusipvm" value={editedDate} onChange={e => setEditedDate(e.target.value)} />
                            <input type="date" className="form-control m-2" aria-describedby="kuolinpvm" selected={endDate} value={endDate} onChange={e => setEndDate(e.target.value)} />
                            <div className="input-group">
                                <select className="form-control m-2" id="inputGroupSelect03" onChange={e => setUpdateStatus(e.target.value)}>
                                    <option value="Elossa" selected>Vaihda hahmon status</option>
                                    <option value="Kuollut" >Kuollut</option>
                                </select>
                            </div>
                            <span className="p-2"><button onClick={() => SaveStatusUpdate(editStatus.hahmonro)} className="btn btn-secondary">Tallenna</button></span>
                            <button onClick={() => setEditStatus(null)} className="btn btn-secondary">Sulje muokkaamatta</button>
                        </div>
                    </>
                )}

            </div>
        </div>

    )
}
