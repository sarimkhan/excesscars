import axios from 'axios';
import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Button, Input, Card, CardBody, CardText, CardTitle, CardSubtitle, Row, Col, Container
} from 'reactstrap';
import { Link } from 'react-router';
import { FaLocationDot } from "react-icons/fa6";
import { IoSpeedometer } from "react-icons/io5";
import SendOffer from '../components/OfferModal';
import BaitLoading from '../components/BaitLoading';

const ITEMS_PER_PAGE = 12;

const VehcileListings = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true)

  // Offer modal state
  const [sendOfferModal, setSendOfferModal] = useState(false);
  const [offer, setOffer] = useState(0);
  const closeSendOffer = () => setSendOfferModal(!sendOfferModal);

  // Data + UI state
  const [vehicles, setVehicles] = useState([]);
  const [htmlstatearray, setHtmlstatearray] = useState([]); // ✅ restored
  const [selectedVin, setSelectedVin] = useState();

  // Filters state
  const [mobileFilter, setMobileFilter] = useState(false)
  const [mobileFilterDiv, setMobileFilterDiv] = useState(false)
  const [actualFilter, setActualFilter] = useState(true)
  const [minYear, setMinYear] = useState(0);
  const [maxYear, setMaxYear] = useState(0);
  const [dbMinyear, setDbMinYear] = useState();
  const [dbMaxyear, setDbMaxYear] = useState();
  const [minYearOptionsArr, setMinYearOptionsArr] = useState([]);
  const [maxYearOptionsArr, setMaxYearOptionsArr] = useState([]);
  const [makes, setMakes] = useState([]);
  const [makesOptions, setMakesOptions] = useState([]);
  const [make, setMake] = useState("");
  const [models, setModels] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const searchFunction = () => {
    setMobileFilter(false)
    let searchString = "/vehicles/?";
    if (minYear != '0') searchString += `minYear=${minYear}&`;
    if (maxYear != '0') searchString += `maxYear=${maxYear}&`;
    if (minPrice !== "") searchString += `minPrice=${minPrice}&`;
    if (maxPrice !== "") searchString += `maxPrice=${maxPrice}&`;
    if (make !== "") searchString += `make=${make}&`;
    if (model !== "") searchString += `model=${model}`;
    window.location.href = searchString;
  };

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobileFilter(true)
      setActualFilter(false)
    }
  }, [])



  // Prefill filter state from searchParams
  useEffect(() => {
    if (searchParams.get('minYear')) setMinYear(searchParams.get('minYear'));
    if (searchParams.get('maxYear')) setMaxYear(searchParams.get('maxYear'));
    if (searchParams.get('minPrice')) setMinPrice(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) setMaxPrice(searchParams.get('maxPrice'));
    if (searchParams.get('make')) setMake(searchParams.get('make'));
    if (searchParams.get('model')) setModel(searchParams.get('model'));
  }, [searchParams]);

  // Load dependent data
  useEffect(() => {
    axios.get(`https://excesscarsapi.onrender.com/getModels/?make=${make}`).then(res => {
      setModels(res.data);
    });
  }, [make]);

  useEffect(() => {
    axios.get("https://excesscarsapi.onrender.com/getMinMaxYear/").then(res => {
      setDbMinYear(res.data[0][0]);
      setDbMaxYear(res.data[0][1]);
    });
    axios.get('https://excesscarsapi.onrender.com/getMakes/').then(res => setMakes(res.data));
  }, []);

  useEffect(() => {
    let tempArr = [];
    let tempArr2 = [];
    for (let i = dbMinyear; i <= dbMaxyear; i++) {
      tempArr.push(<option value={i}>{i}</option>);
      tempArr2.push(<option value={i}>{i}</option>);
    }
    setMinYearOptionsArr(tempArr);
    setMaxYearOptionsArr(tempArr2);
  }, [dbMinyear, dbMaxyear]);

  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < makes.length; i++) {
      tempArr.push(<option value={makes[i][0]}>{makes[i][0]}</option>);
    }
    setMakesOptions(tempArr);
  }, [makes]);

  // Load vehicles from API
  useEffect(() => {
    let hasParams = [...searchParams.keys()].length > 0;
    let fetchUrl = hasParams
      ? "https://excesscarsapi.onrender.com/getFilteredVehicles/?"
      : "https://excesscarsapi.onrender.com/getAllVehicles/";

    if (searchParams.get('minYear')) fetchUrl += `minYear=${searchParams.get('minYear')}&`;
    if (searchParams.get('maxYear')) fetchUrl += `maxYear=${searchParams.get('maxYear')}&`;
    if (searchParams.get('minPrice')) fetchUrl += `minPrice=${searchParams.get('minPrice')}&`;
    if (searchParams.get('maxPrice')) fetchUrl += `maxPrice=${searchParams.get('maxPrice')}&`;
    if (searchParams.get('make')) fetchUrl += `make=${searchParams.get('make')}&`;
    if (searchParams.get('model')) fetchUrl += `model=${searchParams.get('model')}`;

    axios.get(fetchUrl).then(res => {
      setVehicles(res.data);
      setCurrentPage(1);
      setLoading(false)
    });
  }, []);

  // Build paginated HTML cards
  useEffect(() => {
    let htmlarrayLocal = [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, vehicles.length);

    for (let i = startIndex; i < endIndex; i++) {
      let exteriorcolor = vehicles[i][7];
      let interiorcolor = vehicles[i][8];
      let dealerPrice = parseInt(vehicles[i][5]).toLocaleString();
      let savings = (parseInt(vehicles[i][5]) - parseInt(vehicles[i][5] * .90)).toLocaleString();
      let youPay = (parseInt(vehicles[i][5] * .90)).toLocaleString();
      let screensize = window.innerWidth <= 600;

      htmlarrayLocal.push(
        <Col lg={4} md={6} sm={12} key={vehicles[i][6]}>
          <Card className='vehicelCardImg' style={{
            width: '100%',
            marginTop: "20px",
          }}>
            <Link style={{ position: 'relative' }} to={'/vehicle/' + vehicles[i][6]}>
              <img
                width={"100%"}
                style={{ height: screensize ? '35vh' : "28vh", objectFit: "cover" }}
                alt="Sample"
                src={vehicles[i][16].replace('{', '').replace('}', '').split(',')[0]}
              />
              {/* Save Badge */}
              <div style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                padding: '5px 12px',
                borderRadius: '50px',
                background: 'linear-gradient(90deg, #5b28a7ff, #2320c9ff)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}>
                Save Up-To ${savings}
              </div>
              {/* Financing Badge */}
              <div style={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                padding: '3px 10px',
                borderRadius: '50px',
                background: 'linear-gradient(90deg, #dc3545, #ff6b6b)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '11px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
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
              <Row>
                <Col lg={8} md={8} sm={7} xs={7}>
                  <Input placeholder={"Input Offer"} onChange={(e) => setOffer(e.target.value)} />
                </Col>
                <Col lg={4} md={4} sm={5} xs={5}>
                  <Button color='primary' block onClick={() => { setSendOfferModal(true); setSelectedVin(vehicles[i][6]); }}>Send Offer</Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      );
    }

    setHtmlstatearray(htmlarrayLocal);
  }, [vehicles, currentPage]);

  // Pagination logic (reverted old style)
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo(0, 0)
  };

  return (
    <Container fluid className='mt-5'>
      <SendOffer thevin={selectedVin} theoffer={offer} isopen={sendOfferModal} close={closeSendOffer} />
      <Row>
        {/* Mobile Filters */}
        {mobileFilter === true ? <Col lg={12} sm={12} md={12} style={{ position: 'relative', marginTop: '-20px', marginLeft: '-12px' }}>
          <Button onClick={() => { setMobileFilterDiv(!mobileFilterDiv) }} color='dark' style={{ position: 'absolute', right: '0' }}>Filters</Button>
          {mobileFilterDiv === true ? <Card style={{ display: 'block', zIndex: '100000000000', position: 'fixed', width: '100%' }} color='light' className='my-5'>
            <Container>
              <Row>
                <Col lg={6} className='mb-3'>
                  Minimum Year
                  <select value={minYear} className='form-select' onChange={(e) => setMinYear(e.target.value)}>
                    <option selected value="">--Select</option>
                    {minYearOptionsArr}
                  </select>
                </Col>
                <Col lg={6} className='mb-3'>
                  Maximum Year
                  <select value={maxYear} className='form-select' onChange={(e) => setMaxYear(e.target.value)}>
                    <option selected value="">--Select</option>
                    {maxYearOptionsArr}
                  </select>
                </Col>
                <Col lg={6} className='mb-3'>
                  Min Price
                  <Input value={minPrice} type='number' onChange={(e) => setMinPrice(e.target.value)} />
                </Col>
                <Col lg={6} className='mb-3'>
                  Max Price
                  <Input value={maxPrice} type='number' onChange={(e) => setMaxPrice(e.target.value)} />
                </Col>
                <Col lg={12} className='mb-3'>
                  Make
                  <select value={make} className='form-select' onChange={(e) => setMake(e.target.value)}>
                    <option value="">--Select--</option>
                    {makesOptions}
                  </select>
                </Col>
                <Col lg={12} className='mb-3'>
                  Model
                  <select value={model} disabled={!make} className='form-select' onChange={(e) => setModel(e.target.value)}>
                    <option value="">--Select--</option>
                    {modelOptions}
                  </select>
                </Col>
                <Col lg={12} className='d-flex justify-content-end my-2'>
                  <Button color='light' onClick={() => { window.location.href = "/vehicles/"; }}>Reset Filters</Button>
                  <Button color='dark' onClick={searchFunction}>Apply Filters</Button>
                </Col>
                {/* <Col lg={12} className='d-flex justify-content-center mb-3'>
                  <Button color='light' onClick={() => { window.location.href = "/vehicles/"; }}>Reset Filters</Button>
                </Col> */}
              </Row>
            </Container>
          </Card> : <div></div>}

        </Col> : <span></span>}

        {/* Filters */}
        <Col lg={3} style={actualFilter === false ? { display: 'none' } : {}}>
          <Card color='light' className='my-5'>
            <Container>
              <Row className='p-3'>
                <Col lg={6} className='mb-3'>
                  Minimum Year
                  <select value={minYear} className='form-select' onChange={(e) => setMinYear(e.target.value)}>
                    <option selected value="">--Select</option>
                    {minYearOptionsArr}
                  </select>
                </Col>
                <Col lg={6} className='mb-3'>
                  Maximum Year
                  <select value={maxYear} className='form-select' onChange={(e) => setMaxYear(e.target.value)}>
                    <option selected value="">--Select</option>
                    {maxYearOptionsArr}
                  </select>
                </Col>
                <Col lg={6} className='mb-3'>
                  Min Price
                  <Input value={minPrice} type='number' onChange={(e) => setMinPrice(e.target.value)} />
                </Col>
                <Col lg={6} className='mb-3'>
                  Max Price
                  <Input value={maxPrice} type='number' onChange={(e) => setMaxPrice(e.target.value)} />
                </Col>
                <Col lg={12} className='mb-3'>
                  Make
                  <select value={make} className='form-select' onChange={(e) => setMake(e.target.value)}>
                    <option value="">--Select--</option>
                    {makesOptions}
                  </select>
                </Col>
                <Col lg={12} className='mb-3'>
                  Model
                  <select value={model} disabled={!make} className='form-select' onChange={(e) => setModel(e.target.value)}>
                    <option value="">--Select--</option>
                    {modelOptions}
                  </select>
                </Col>
                <Col lg={12} className='d-flex justify-content-center my-2'>
                  <Button color='dark' onClick={searchFunction}>Apply Filters</Button>
                </Col>
                <Col lg={12} className='d-flex justify-content-center mb-3'>
                  <Button color='light' onClick={() => { window.location.href = "/vehicles/"; }}>Reset Filters</Button>
                </Col>
              </Row>
            </Container>
          </Card>
        </Col>

        {/* Vehicle listings */}
        {loading === true ? <BaitLoading text="Reeling in dealer response..."/> : <Col lg={9}>
          <Row>
            <Col lg={12}><h5>{vehicles.length} Vehicles Found</h5></Col>
            {vehicles.length > 0 ? htmlstatearray : <h4>No results found</h4>}</Row>

          {/* Pagination (old style) */}
          {vehicles.length > ITEMS_PER_PAGE && (
            <div className='d-flex justify-content-center my-4'>
              <Button color='secondary' className='mx-1' disabled={currentPage === 1} onClick={() => goToPage(1)}>&laquo;</Button>
              <Button color='secondary' className='mx-1' disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>&lsaquo;</Button>

              {(() => {
                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(totalPages, startPage + 3);

                if (endPage - startPage < 3) {
                  startPage = Math.max(1, endPage - 3);
                }

                let pages = [];
                for (let p = startPage; p <= endPage; p++) {
                  pages.push(
                    <Button
                      key={p}
                      color={p === currentPage ? 'primary' : 'secondary'}
                      className='mx-1'
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </Button>
                  );
                }
                return pages;
              })()}

              <Button color='secondary' className='mx-1' disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>&rsaquo;</Button>
              <Button color='secondary' className='mx-1' disabled={currentPage === totalPages} onClick={() => goToPage(totalPages)}>&raquo;</Button>
            </div>
          )}
        </Col>}
        
      </Row>
    </Container>
  );
};

export default VehcileListings;
