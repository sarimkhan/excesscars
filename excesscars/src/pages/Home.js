import {
    Row, Container, Col, Card, CardHeader, CardBody, CardText, CardTitle, Input, Button, Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import bannerImage from '../images/ridebaitBanner.png'
import { TbFishHook } from "react-icons/tb";
import { useState, useEffect } from 'react';
import axios from 'axios';

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
    const searchFunction = () => {
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
    return (<>
        <div style={{ position: 'relative' }}>
            <img style={{ objectFit: 'cover', height: window.innerWidth > 600 ? '100%' : '350px' }} width={'100%'} src={bannerImage} />
            <div style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', backgroundColor: 'black', opacity: '0.7' }}></div>
            <div style={{ color: 'white', position: 'absolute', top: '20%', left: '10%' }}>
                <h1 className='text-primary' style={{ fontWeight: 'bold' }}>Ride{<TbFishHook />}Bait</h1>
                <h3 style={{ marginTop: '-10px', fontWeight: 'bold' }}>Reel In Your Next Ride</h3>
                <h5 style={{ marginTop: '20px' }}>Bait The Dealer - Save Thousands <br /> Shop Through <span style={{ fontWeight: 'bold' }}>Ride Bait</span></h5>
                <a href='/vehicles'><Button className='mt-2' color='primary'>Browse Vehicles</Button></a>
            </div>

        </div>
        <Container>
            <Row>
                <Col style={{position:'relative'}} lg={2} md={2} sm={12} xs={12} className='my-3'>
                <h6 style={{position:'absolute', left:'35%', top:'50%'}}>Search Specific</h6>
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
                <Col style={{position:'relative'}} lg={2} md={2} sm={12} xs={12} className='my-3'>
                <Button style={{position:'absolute', top:'38%'}} color='dark' onClick={searchFunction}>Search</Button>
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
                                Skip the endless haggling. RideBait surfaces deals where the <strong>savings are already on the table</strong> — often thousands below typical dealer prices.
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
