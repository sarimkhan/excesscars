import {
    Row, Container, Col, Card, CardHeader, CardBody, CardText, CardTitle, Input, Button, Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, CardSubtitle
} from 'reactstrap';
import { IoSpeedometer } from 'react-icons/io5';
import { Link } from 'react-router';
import bannerImage from '../images/ridebaitBanner.png'
import { TbFishHook } from "react-icons/tb";
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import { FaCarOn } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { useLocation } from 'react-router';

const Home = (props) => {
    const [minYear, setMinYear] = useState(0)
    const [maxYear, setMaxYear] = useState(0)
    const [dbMinyear, setDbMinYear] = useState()
    const [dbMaxyear, setDbMaxYear] = useState()
    const [minYearOptionsArr, setMinYearOptionsArr] = useState([])
    const [maxYearOptionsArr, setMaxYearOptionsArr] = useState([])
    const [makes, setMakes] = useState([])
    const [makesOptions, setMakesOptions] = useState([])
    const [make, setMake] = useState("")
    const [models, setModels] = useState([])
    const [modelOptions, setModelOptions] = useState([])
    const [model, setModel] = useState("")
    const [vehicles, setVehicles] = useState([]);
    const [htmlstatearray, setHtmlstatearray] = useState([]);
    const [viewMoreBtnHit, setViewMoreBtnHit] = useState(0)
    useEffect(() => {
        ReactGA.initialize('G-QZ4EFNV649');
        // Extract GCLID from URL if present
        const params = new URLSearchParams(window.location.search);
        const gclid = params.get('gclid');
        if (gclid) {
            localStorage.setItem('gclid', gclid); // store for later events
            console.log('GCLID saved:', gclid);
        }

        // Send pageview with a custom path
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search, title: "Home Page" });
    }, [])
    const searchFunction = () => {
        ReactGA.event({
            category: 'ButtonClick',
            action: 'SearchButtonClicked',
            value: 1,
            gclid: localStorage.getItem('gclid') || undefined
        });
        let searchString = "/vehicles/?"
        if (minYear != '0') {
            searchString = searchString + "minYear=" + minYear.toString() + "&"
        }
        if (maxYear != '0') {
            searchString = searchString + "maxYear=" + maxYear.toString() + "&"
        }
        if (make != "") {
            searchString = searchString + "make=" + make + "&"
        }
        if (model != "") {
            searchString = searchString + "model=" + model
        }
        window.location.href = searchString
    }
    useEffect(() => {
        axios.get("https://excesscarsapi.onrender.com/getModels/?make=" + make).then((res) => {
            setModels(res.data)
        })
    }, [make])
    useEffect(() => {
        let tempArr = []
        try {
            for (let i = 0; i < models.length; i++) {
                tempArr.push(<option value={models[i][0]}>{models[i][0]}</option>)
            }
        }
        catch {
            console.log("error")
        }
        setModelOptions(tempArr)
    }, [models])
    useEffect(() => {
        axios.get("https://excesscarsapi.onrender.com/getMinMaxYear/").then((res) => { setDbMinYear(res.data[0][0]); setDbMaxYear(res.data[0][1]) })
    }, [])
    useEffect(() => {
        axios.get('https://excesscarsapi.onrender.com/getMakes/').then((res => { setMakes(res.data) }))
    }, [])
    useEffect(() => {
        let tempArr = []
        let tempArr2 = []
        let tempString = ""
        for (let i = dbMinyear; i <= dbMaxyear; i++) {
            if (minYear > i) {
                tempString = <option disabled value={i}>{i}</option>
            }
            else {
                tempString = <option value={i}>{i}</option>
            }
            if (i == dbMaxyear) {
                tempString = <option selected value={i}>{i}</option>
            }
            tempArr2.push(tempString)
        }

        for (let i = dbMinyear; i <= dbMaxyear; i++) {
            let tempString = ""
            if (i > maxYear && maxYear > 0) {
                tempString = <option disabled value={i}>{i}</option>
            }
            else {
                tempString = <option value={i}>{i}</option>
            }
            tempArr.push(tempString)
        }
        setMinYearOptionsArr(tempArr)
        setMaxYearOptionsArr(tempArr2)

    }, [dbMinyear, dbMaxyear, minYear, maxYear])
    useEffect(() => {
        let tempArr = []
        for (let i = 0; i < makes.length; i++) {
            tempArr.push(<option value={makes[i][0]}>{makes[i][0]}</option>)
        }
        setMakesOptions(tempArr)
    }, [makes])
    useEffect(() => {
        axios.get('https://excesscarsapi.onrender.com/getFeaturedVehicles/').then((res) => {
            setVehicles(res.data);
            ReactGA.event({
                category: 'user_behavior',
                action: 'HomeFeatureLoaded',
                value: 1,
                gclid: localStorage.getItem('gclid') || undefined
            });
        })
    }, [])
    useEffect(() => {
        let htmlarrayLocal = [];

        for (let i = 0; i < vehicles.length; i++) {
            let dealerPrice = parseInt(vehicles[i][5]).toLocaleString();
            let savings = (parseInt(vehicles[i][5]) - parseInt(vehicles[i][5] * .90)).toLocaleString();
            let youPay = (parseInt(vehicles[i][5] * .90)).toLocaleString();
            let screensize = window.innerWidth <= 600;

            let text = vehicles[i][16].replace('{', '').replace('}', '');
            let imgUrls = [...text.matchAll(/"([^"]+)"/g)].map(match => match[1]);
            htmlarrayLocal.push(
                <Col lg={3} md={3} sm={12} key={vehicles[i][6]}>
                    <Card className='vehicelCardImg' style={{ width: '100%', marginTop: "20px" }}>
                        <Link style={{ position: 'relative' }} to={'/vehicle/' + vehicles[i][6]}>
                            <img
                                width={"100%"}
                                style={{ height: screensize ? '35vh' : "28vh", objectFit: "cover" }}
                                alt="Sample"
                                src={imgUrls.length === 0
                                    ? vehicles[i][16].replace('{', '').replace('}', '').split(',')[0]
                                    : imgUrls[0]}
                            />
                            {/* Save Badge */}
                            <div style={{
                                position: 'absolute', left: '10px', top: '10px',
                                padding: '5px 12px', borderRadius: '50px',
                                background: 'linear-gradient(90deg, #5b28a7ff, #2320c9ff)',
                                color: 'white', fontWeight: 'bold', fontSize: '18px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}>
                                Save Up-To ${savings}
                            </div>
                            {/* Financing Badge */}
                            <div style={{
                                position: 'absolute', right: '10px', bottom: '10px',
                                padding: '3px 10px', borderRadius: '50px',
                                background: 'linear-gradient(90deg, #dc3545, #ff6b6b)',
                                color: 'white', fontWeight: 'bold', fontSize: '13px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            }}>
                                Financing Available
                            </div>
                        </Link>
                        <CardBody>
                            <CardTitle tag="h5">{vehicles[i][4]} {vehicles[i][2]} {vehicles[i][3]}</CardTitle>
                            <CardSubtitle className="mb-2 text-muted" tag="h6">
                                <Row>
                                    <Col lg={12}>{vehicles[i][18]}</Col>
                                    <Col lg={12} className='text-end' style={{ fontSize: "14px", fontWeight: 'bold' }}>
                                        <IoSpeedometer /> {parseInt(vehicles[i][12]).toLocaleString()} miles
                                    </Col>
                                </Row>
                            </CardSubtitle>
                            <CardText>
                                <Row>
                                    <Col>Dealer Price<br /><h4>${dealerPrice}</h4></Col>
                                    <Col className='text-end'>Suggested Offer<br /><h4 className='text-success'>${youPay}</h4></Col>
                                </Row>
                            </CardText>
                            {/* <Row>
                                <Col lg={8} md={8} sm={7} xs={7}>
                                    <Input placeholder={"Your Offer"} onChange={(e) => setOffer(e.target.value)} />
                                </Col>
                                <Col lg={4} md={4} sm={5} xs={5}>
                                    <Button color='primary' block onClick={() => {
                                        setSendOfferModal(true);
                                        setSelectedVin(vehicles[i][6]);
                                        ReactGA.event({
                                            category: 'ButtonClick',
                                            action: 'OfferInitiateClick',
                                            label: 'OfferInitiate',
                                        });
                                    }}>Send Offer</Button>
                                </Col>
                            </Row> */}
                            <Row className='mt-3'><Link style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }} to={'/vehicle/' + vehicles[i][6]}><Button color='light'>View Details</Button></Link></Row>
                        </CardBody>
                    </Card>
                </Col>
            );
        }
        setHtmlstatearray(htmlarrayLocal);
    }, [vehicles]);

    useEffect(() => {
        const startTime = Date.now();
        const handleBeforeUnload = () => {
            const endTime = Date.now();
            const timeSpentSeconds = Math.round((endTime - startTime) / 1000);
            ReactGA.event({
                category: 'user_behavior',
                action: 'Home Secs',
                value: timeSpentSeconds,
                label: timeSpentSeconds + "secs Spent",
                gclid: localStorage.getItem('gclid') || undefined
            });
            console.log(`User spent ${timeSpentSeconds} seconds on the vehicle page.`);
        };
        window.addEventListener('pagehide', handleBeforeUnload);
        return () => {
            window.removeEventListener('pagehide', handleBeforeUnload);
            handleBeforeUnload(); // Also log when component unmounts (e.g., SPA navigation)
        };
    }, []);

    const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible
            ? ((top > 0 && top < innerHeight) ||
                (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
            : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    };

    useEffect(() => {
        let tt = 0
        const handleScroll = () => {
            console.log('Scrolled to:', window.scrollY);
            if (elementIsVisibleInViewport(document.getElementById('viewMoreBtn')) === true && tt < 1) {
                ReactGA.event({
                    category: 'user_behavior',
                    action: 'ViewButtonScrolled',
                    value: 1,
                    gclid: localStorage.getItem('gclid') || undefined
                });
                tt += 1
            }
        };
        window.addEventListener('scroll', handleScroll);
        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (<>
        <div style={{ position: 'relative' }}>
            <img style={{ objectFit: 'cover', height: window.innerWidth > 600 ? '100%' : '350px' }} width={'100%'} src={bannerImage} />
            <div style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', backgroundColor: 'black', opacity: '0.7' }}></div>
            <div style={{ color: 'white', position: 'absolute', top: '20%', left: '10%' }}>
                <h1 className='text-primary' style={{ fontWeight: 'bold' }}>Ride{<TbFishHook />}Bait</h1>
                <h3 style={{ marginTop: '-10px', fontWeight: 'bold' }}>Over 2000 Used Trucks Cars SUVs<br/>Finance Or Buy Cash</h3>
                <h5 style={{ marginTop: '20px' }}>Send A No Commitment Offer Today<br/><span style={{ fontWeight: 'bold' }}>Save Thousands</span></h5>
                <a href='/vehicles'><Button onClick={() => {
                    ReactGA.event({
                        category: 'ButtonClick',
                        action: 'BrowseBtnHome',
                        value: 1,
                        gclid: localStorage.getItem('gclid') || undefined
                    });
                }} className='mt-2' color='primary'>Browse Vehicles</Button></a>
            </div>
        </div>
        <Container>
            <Row className='text-center mt-4 bg-light'>
                <br /><br /><h3 className='mt-5'><FaCarOn />Featured Vehicles<FaCarOn /></h3>
            </Row>
            <Row className='bg-light'>
                <br /><br />
                {htmlstatearray.length > 0 ? htmlstatearray : <Col lg={12} className='text-center'><h5>Loading...</h5></Col>}
            </Row>
            <Row className='bg-light' id='viewMoreBtn'>
                <br /> <br /><br />
                <Col className='bg-light d-flex justify-content-center' lg={12}><a style={{ alignSelf: 'center' }} href='/vehicles'><Button onClick={() => {
                    ReactGA.event({
                        category: 'ButtonClick',
                        action: 'ViewMoreButtonClicked',
                        value: 1,
                        gclid: localStorage.getItem('gclid') || undefined
                    });
                }} style={{ width: '25vh' }} color='primary'>View More</Button></a></Col>
                <br /> <br /><br /><br /> <br /><br />
            </Row>
            <Row className='text-center mt-4'>
                <br /><br /><h3 className='mt-5'><FaRankingStar />Popular Filters<FaRankingStar /></h3>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Col className='mt-3' lg='8' md='10' sm='12' xs='12'>
                    <Row>
                        <Col lg='3' xs='4' className='my-2'><a href='/vehicles?maxPrice=10000'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'Quick$10k',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} outline style={{ minWidth: '100%' }} color='dark'>~$10,000</Button></a></Col>
                        <Col lg='2' xs='4' className='my-2'><a href='/vehicles?body=Pickup'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'QuickTrucks',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} style={{ minWidth: '100%' }} outline color='dark'>Trucks</Button></a></Col>
                        <Col lg='3' xs='4' className='my-2'><a href='/vehicles?maxPrice=15000'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'Quick$15k',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} color='dark' outline style={{ minWidth: '100%' }}>~$15,000</Button></a></Col>
                        <Col lg='4' xs='4' className='my-2'><a href='/vehicles?make=Ford&model=F-150'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'QuickF-150',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} color='dark' outline style={{ minWidth: '100%' }}>Ford F-150</Button></a></Col>
                        <Col lg='5' xs='5' className='my-2'><a href='/vehicles?minYear=2025'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'Quick2025',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} outline color='dark' style={{ minWidth: '100%' }}>Latest</Button></a></Col>
                        <Col lg='3' xs='3' className='my-2'><a href='/vehicles?make=Toyota'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'QuickToyota',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} outline color='dark' style={{ minWidth: '100%' }}>Toyota</Button></a></Col>
                        <Col lg='4' xs='6' className='my-2'><a href='/vehicles?maxPrice=7000'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'QuickCash',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} style={{ minWidth: '100%' }} outline color='dark'>Cash Cars</Button></a></Col>
                        <Col lg='4' xs='6' className='my-2'><a href='/vehicles?minYear=2020'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'Quick2020',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} style={{ minWidth: '100%' }} outline color='dark'>2020 or Newer</Button></a></Col>
                        <Col lg='1' xs='4' className='my-2'><a href='/vehicles?body=SUV'><Button onClick={() => {
                            ReactGA.event({
                                category: 'ButtonClick',
                                action: 'QuickSUVs',
                                value: 1,
                                gclid: localStorage.getItem('gclid') || undefined
                            });
                        }} outline style={{ minWidth: '100%' }} color='dark'>SUVs</Button></a></Col>
                        <br /><br /><br /><br />
                        <Col style={{ display: 'flex', justifyContent: 'center' }} lg='12' xs='12'><a href='/vehicles'><Button color='primary'>View All Cars</Button></a></Col>
                        <br /><br /><br /><br />
                    </Row>
                </Col>

            </Row>


            <Row className='mt-5 text-center'>
                <h3>Search A Specific Car <FaSearch /></h3>
            </Row>
            <Row>
                <Col style={{ position: 'relative' }} lg={2} md={2} sm={12} xs={12}>
                    <h6 style={{ position: 'absolute', left: '35%', top: '50%' }}>Search Specific</h6>
                </Col>
                <Col lg={2} md={2} sm={12} xs={12} className='my-3'>
                    Minimum Year
                    <select className='form-select' onChange={(e) => setMinYear(e.target.value)}>
                        {minYearOptionsArr}
                    </select>
                </Col>
                <Col lg={2} md={2} sm={12} xs={12} className='my-3'>
                    Maximium Year
                    <select className='form-select' onChange={(e) => setMaxYear(e.target.value)}>

                        {maxYearOptionsArr}
                    </select>
                </Col>
                <Col lg={2} md={2} sm={12} xs={12} className='my-3'>
                    Make
                    <select className='form-select' onChange={(e) => setMake(e.target.value)}>
                        <option selected value={""}>--Select--</option>
                        {makesOptions}
                    </select>
                </Col>
                <Col lg={2} md={2} sm={12} xs={12} className='my-3'>
                    Model
                    <select disabled={make == "" ? true : false} className='form-select' onChange={(e) => setModel(e.target.value)}>
                        <option selected value={""}>--Select--</option>
                        {modelOptions}
                    </select>
                </Col>
                <Col style={{ position: 'relative' }} lg={2} md={2} sm={12} xs={12} className='my-3'>
                    <Button style={{ position: 'absolute', top: '38%' }} color='dark' onClick={searchFunction}>Search</Button>
                </Col>
            </Row>
        </Container>

        {/* -------------------------------- */}
        {/* Bottom feature cards (updated)   */}
        {/* -------------------------------- */}
        <Container fluid className='my-5'>
            <Row className="g-4">
                {/* Left Card - How it Works with background image */}
                <Col lg={{ size: 5, offset: 1 }} md={{ size: 5, offset: 1 }} sm={12} xs={12}>
                    <Card
                        className="h-100 shadow-sm border-0 rounded text-white"
                        style={{
                            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: window.innerWidth > 600 ? '500px' : '300px'
                        }}
                    >
                        <CardBody className="d-flex flex-column justify-content-center align-items-center text-center p-4">
                            <h2 className="fw-bold mb-3">Instant Savings, Real Results</h2>
                            <CardText className="mb-4">
                                Save Thousands On Used Cars. Discover great deals on vehicles and bait the dealer to save thousands. RideBait surfaces deals where the <strong>savings are already on the table</strong> — often thousands below typical dealer prices.
                            </CardText>
                            <Button color="light" size="lg" href="/vehicles" className="fw-bold">
                                Browse Vehicles
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg={5} md={5} sm={12} xs={12}>
                    <Card
                        className="h-100 shadow-sm border-0 rounded text-white"
                        style={{
                            backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/handshake.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: window.innerWidth > 600 ? '500px' : '300px'
                        }}
                    >
                        <CardBody className="d-flex flex-column justify-content-center align-items-center text-center p-4">
                            <TbFishHook size={50} className="mb-3 text-light" />
                            <CardTitle tag="h3" className="fw-bold mb-3">How RideBait Works</CardTitle>
                            <CardText className="mb-4">
                                We only list vehicles from dealers who are <strong>ready to negotiate</strong> and sell <strong>quickly</strong>.
                                Our proprietary, data-driven algorithm spots motivated sellers so you start the conversation with leverage.
                            </CardText>
                            <Button color="light" size="lg" href="/howitworks">
                                Learn More
                            </Button>
                        </CardBody>
                    </Card>
                </Col>

                {/* Right Card - Savings with background image */}

            </Row>
        </Container>
    </>)
}

export default Home;
