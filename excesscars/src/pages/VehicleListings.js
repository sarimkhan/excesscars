import axios from 'axios';
import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  Button, Input, Card, CardBody, CardText, CardTitle, CardSubtitle, Row, Col, Container, Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse
} from 'reactstrap';
import { Link } from 'react-router';
import { IoSpeedometer } from "react-icons/io5";
import SendOffer from '../components/OfferModal';
import BaitLoading from '../components/BaitLoading';
import { FaRankingStar } from "react-icons/fa6";
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router';

const ITEMS_PER_PAGE = 12;

const VehcileListings = () => {
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
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search, title: "Listing Page" });
  }, [])
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Offer modal state
  const [sendOfferModal, setSendOfferModal] = useState(false);
  const [offer, setOffer] = useState(0);
  const closeSendOffer = () => setSendOfferModal(!sendOfferModal);

  // Data + UI state
  const [vehicles, setVehicles] = useState([]);
  const [htmlstatearray, setHtmlstatearray] = useState([]);
  const [selectedVin, setSelectedVin] = useState();
  const [initialState, setIntitialState] = useState(true);
  const [collapseOpen, setCollapseOpen] = useState(true);

  // Filters state
  const [mobileFilter, setMobileFilter] = useState(false);
  const [mobileFilterDiv, setMobileFilterDiv] = useState(false);
  const [actualFilter, setActualFilter] = useState(true);
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
  const [bodys, setBodys] = useState([]);
  const [bodyOptions, setBodyOptions] = useState([]);
  const [body, setBody] = useState("");
  const [locations, setLocations] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ddOpen, setDdopen] = useState(false);
  const [ddSelect, setDdSelect] = useState("");

  const toggleCollapse = () => setCollapseOpen(!collapseOpen)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // ---------- State Persistence Logic ----------
  const saveState = () => {
    const state = {
      url: window.location.search, // include filters
      page: currentPage
    };
    localStorage.setItem('vehicleListingsState', JSON.stringify(state));
  };

  // Restore state on mount
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('vehicleListingsState') || 'null');
    if (savedState && savedState.url === window.location.search) {
      setCurrentPage(savedState.page);
      // scroll restoration happens later after htmlstatearray renders
    }
    document.title = "Inventory";
  }, []);

  // Restore scroll AFTER htmlstatearray renders and matches saved state
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('vehicleListingsState') || 'null');
    if (!loading && htmlstatearray.length > 0 && savedState && savedState.url === window.location.search) {
      const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
      const pageToRestore = savedState.page <= totalPages ? savedState.page : 1;
      if (pageToRestore !== currentPage) {
        setCurrentPage(pageToRestore);
      }
      setTimeout(() => {
        if (initialState) {
          window.scrollTo(0, savedState.scroll);
        }

      }, 50);
    }
  }, [htmlstatearray, loading]);

  // Save state when page changes
  useEffect(() => {
    saveState();
  }, [currentPage]);

  // Save state before unload
  useEffect(() => {
    window.addEventListener('beforeunload', saveState);
    window.addEventListener('pagehide', saveState);
    return () => {
      window.removeEventListener('beforeunload', saveState);
      window.removeEventListener('pagehide', saveState);
    };
  }, [currentPage]);
  // ---------------------------------------------

  function shuffleArray(array) {
    // Create a copy of the array to avoid modifying the original if desired
    const shuffledArray = [...array];

    // Iterate backwards through the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      // Generate a random index 'j' within the remaining unsorted portion
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements at indices 'i' and 'j'
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

  // Apply filters
  const searchFunction = () => {
    setMobileFilter(false);
    let searchString = "/vehicles/?";
    if (minYear != '0') searchString += `minYear=${minYear}&`;
    if (maxYear != '0') searchString += `maxYear=${maxYear}&`;
    if (minPrice !== "") searchString += `minPrice=${minPrice}&`;
    if (maxPrice !== "") searchString += `maxPrice=${maxPrice}&`;
    if (make !== "") searchString += `make=${make}&`;
    if (model !== "") searchString += `model=${model}&`;
    if (body !== "") searchString += `body=${body}&`;
    if (location !== "") searchString += `location=${location}&`;
    window.location.href = searchString;
  };

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobileFilter(true);
      setActualFilter(false);
    }
  }, []);

  // Prefill filter state from searchParams
  useEffect(() => {
    if (searchParams.get('minYear')) setMinYear(searchParams.get('minYear'));
    if (searchParams.get('maxYear')) setMaxYear(searchParams.get('maxYear'));
    if (searchParams.get('minPrice')) setMinPrice(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) setMaxPrice(searchParams.get('maxPrice'));
    if (searchParams.get('make')) setMake(searchParams.get('make'));
    if (searchParams.get('model')) {
      setModel(searchParams.get('model'));
    }
    else {
      setModel("")
    }
    if (searchParams.get('body')) setBody(searchParams.get('body'));
    if (searchParams.get('location')) setLocation(searchParams.get('location'));
  }, [searchParams]);

  // Load dependent data
  useEffect(() => {


    axios.get(`https://excesscarsapi.onrender.com/getModels/?make=${make}`).then(res => {
      setModels(res.data);
    });
  }, [make]);
  useEffect(() => {
    if (modelOptions.length > 0) {
      modelOptions.length = 0
    }
    let tempArr = [];
    try {
      for (let i = 0; i < models.length; i++) {
        tempArr.push(<option value={models[i][0]}>{models[i][0]}</option>);
      }
    } catch {
      console.log("error");
    }
    setModelOptions(tempArr);
    setModel("")
  }, [models]);

  useEffect(() => {
    axios.get("https://excesscarsapi.onrender.com/getMinMaxYear/").then(res => {
      setDbMinYear(res.data[0][0]);
      setDbMaxYear(res.data[0][1]);
    });
    axios.get('https://excesscarsapi.onrender.com/getMakes/').then(res => setMakes(res.data));
    axios.get('https://excesscarsapi.onrender.com/getBodys/').then(res => setBodys(res.data));
    axios.get('https://excesscarsapi.onrender.com/getLocations/').then(res => setLocations(res.data));
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
    let SortedMakes = []
    for (let i = 0; i < makes.length; i++) {
      SortedMakes.push(makes[i][0])
    }
    SortedMakes = SortedMakes.sort()
    for (let i = 0; i < SortedMakes.length; i++) {
      tempArr.push(<option value={SortedMakes[i]}>{SortedMakes[i]}</option>);
    }
    setMakesOptions(tempArr);
    console.log(SortedMakes)
  }, [makes]);

  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < bodys.length; i++) {
      if (bodys[i][0] != "") {
        tempArr.push(<option value={bodys[i][0]}>{bodys[i][0]}</option>);
      }
    }
    setBodyOptions(tempArr);
  }, [bodys]);

  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < locations.length; i++) {
      if (locations[i][0] != "") {
        tempArr.push(<option value={locations[i][0]}>{locations[i][0]}</option>);
      }
    }
    setLocationOptions(tempArr);
  }, [locations]);

  // Load vehicles from API
  useEffect(() => {
    let hasParams = [...searchParams.keys()].length > 0;
    let fetchUrl = hasParams
      ? "https://excesscarsapi.onrender.com/getFilteredVehicles/?"
      : "https://excesscarsapi.onrender.com/getAllVehicles/";
    if (!hasParams) {
      axios.get('https://excesscarsapi.onrender.com/getFeaturedVehicles/').then((res) => {
        setVehicles(res.data); setLoading(false); setIntitialState(false);
        ReactGA.event({
          category: 'user_behavior',
          action: 'LoadedFTVehicles',
          gclid: localStorage.getItem('gclid') || undefined
        });
      }).then(() => {
        axios.get(fetchUrl).then((res) => {
          setVehicles(shuffleArray(res.data))
          ReactGA.event({
            category: 'user_behavior',
            action: 'LoadedVehicles',
            gclid: localStorage.getItem('gclid') || undefined
          });
        })

      })
    }
    else {
      if (searchParams.get('minYear')) fetchUrl += `minYear=${searchParams.get('minYear')}&`;
      if (searchParams.get('maxYear')) fetchUrl += `maxYear=${searchParams.get('maxYear')}&`;
      if (searchParams.get('minPrice')) fetchUrl += `minPrice=${searchParams.get('minPrice')}&`;
      if (searchParams.get('maxPrice')) fetchUrl += `maxPrice=${searchParams.get('maxPrice')}&`;
      if (searchParams.get('make')) fetchUrl += `make=${searchParams.get('make')}&`;
      if (searchParams.get('model')) fetchUrl += `model=${searchParams.get('model')}&`;
      if (searchParams.get('body')) fetchUrl += `body=${searchParams.get('body')}&`;
      if (searchParams.get('location')) fetchUrl += `location=${searchParams.get('location')}&`;
      if (searchParams.get('minYear') || searchParams.get('maxYear') || searchParams.get('minPrice') || searchParams.get('maxPrice') || searchParams.get('make') || searchParams.get('model') || searchParams.get('body')) {
        axios.get(fetchUrl).then(res => {
          {
            setVehicles(res.data); setLoading(false);
            ReactGA.event({
              category: 'user_behavior',
              action: 'LoadedFilterVehicles',
              gclid: localStorage.getItem('gclid') || undefined
            });
          }
        });
      }
      else {
        axios.get('https://excesscarsapi.onrender.com/getFeaturedVehicles/').then((res) => {
          setVehicles(res.data); setLoading(false); setIntitialState(false);
          ReactGA.event({
            category: 'user_behavior',
            action: 'LoadedFTVehicles',
            gclid: localStorage.getItem('gclid') || undefined
          });
        }).then(() => {
          axios.get(fetchUrl).then((res) => {
            setVehicles(shuffleArray(res.data))
            ReactGA.event({
              category: 'user_behavior',
              action: 'LoadedVehicles',
              gclid: localStorage.getItem('gclid') || undefined
            });
          })

        })
      }

    }


  }, []);

  // Build paginated HTML cards
  useEffect(() => {
    console.log("vehicles affected")
    console.log(vehicles)
    let htmlarrayLocal = [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, vehicles.length);

    for (let i = startIndex; i < endIndex; i++) {
      let dealerPrice = parseInt(vehicles[i][5]).toLocaleString();
      let savings = (parseInt(vehicles[i][5]) - parseInt(vehicles[i][5] * .90)).toLocaleString();
      let youPay = (parseInt(vehicles[i][5] * .90)).toLocaleString();
      let screensize = window.innerWidth <= 600;

      let text = vehicles[i][16].replace('{', '').replace('}', '');
      let imgUrls = [...text.matchAll(/"([^"]+)"/g)].map(match => match[1]);
      htmlarrayLocal.push(
        <Col lg={4} md={6} sm={12} key={vehicles[i][6]}>
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
              <Row>
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
                      gclid: localStorage.getItem('gclid') || undefined
                    });
                  }}>Send Offer</Button>
                </Col>
              </Row>
              <Row className='mt-3'><Link style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }} to={'/vehicle/' + vehicles[i][6]}><Button style={{ width: '100%' }} color='light'>View Details</Button></Link></Row>
            </CardBody>
          </Card>
        </Col>
      );
    }
    setHtmlstatearray([htmlarrayLocal]);
  }, [vehicles, currentPage]);

  //SortFunction
  function sortVehicles(sortString) {
    const sortedV = [...vehicles]
    if (sortString === "yearasc") {
      sortedV.sort((a, b) => a[4] - b[4])
    }
    if (sortString === "yeardesc") {
      sortedV.sort((a, b) => b[4] - a[4])
    }
    if (sortString === "milesasc") {
      sortedV.sort((a, b) => a[12] - b[12])
    }
    if (sortString === "milesdesc") {
      sortedV.sort((a, b) => b[12] - a[12])
    }
    if (sortString === "priceasc") {
      sortedV.sort((a, b) => a[5] - b[5])
    }
    if (sortString === "pricedesc") {
      sortedV.sort((a, b) => b[5] - a[5])
    }
    setVehicles(sortedV)
    setCurrentPage(1)
    console.log(vehicles)
  }

  // Pagination logic
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const goToPage = (page) => {
    setIntitialState(false)
    ReactGA.event({
      category: 'ButtonClick',
      action: 'Pagination Clicked',
      value: page,
      gclid: localStorage.getItem('gclid') || undefined
    });
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    if (!initialState) {
      window.scrollTo(0, 0);
    }

  };


  useEffect(() => {
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const endTime = Date.now();
      const timeSpentSeconds = Math.round((endTime - startTime) / 1000);
      ReactGA.event({
        category: 'user_behavior',
        action: 'Listing Secs',
        label: timeSpentSeconds + "secs spent",
        value: timeSpentSeconds,
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
    if (document.body.contains(el)) {
      const { top, left, bottom, right } = el.getBoundingClientRect();
      const { innerHeight, innerWidth } = window;
      return partiallyVisible
        ? ((top > 0 && top < innerHeight) ||
          (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    }

  };
  useEffect(() => {
    let tt = 0
    const handleScroll = () => {
      console.log('Scrolled to:', window.scrollY);
      if (elementIsVisibleInViewport(document.getElementById('paginationBtn')) === true && tt < 1) {
        console.log("visible")
        ReactGA.event({
          category: 'user_behavior',
          action: 'PaginationScrolled',
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




  return (
    <Container fluid>
      <SendOffer thevin={selectedVin} theoffer={offer} isopen={sendOfferModal} close={closeSendOffer} />
      <Row className='text-center mt-3' style={{ display: 'flex', justifyContent: 'center' }}><Button style={{ width: "30vh" }} color='primary' onClick={() => setCollapseOpen(!collapseOpen)}><FaRankingStar /> Popular Filters <FaRankingStar /></Button>
      </Row>
      <Collapse isOpen={collapseOpen}>
        <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <Col className='mt-1' lg='8' md='10' sm='12' xs='12'>
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
            </Row>
          </Col>

        </Row>
      </Collapse>

      <Row style={{ marginTop: '50px' }}>
        {/* Mobile Filters */}
        {mobileFilter === true ? <Col lg={12} sm={12} md={12} style={{ position: 'relative', marginTop: '-20px', marginLeft: '-12px' }}>
          <Button onClick={() => {
            setMobileFilterDiv(!mobileFilterDiv);
            ReactGA.event({
              category: 'ButtonClick',
              action: 'MobileFilterClick',
              label: 'MobileFilterOpen',
              gclid: localStorage.getItem('gclid') || undefined
            });
          }} color='dark' style={{ position: 'absolute', right: '0' }}>Filters</Button>
          {mobileFilterDiv === true ? <Card style={{ display: 'block', zIndex: '100000000000', position: 'absolute', width: '100%' }} color='light' className='my-5'>
            <Container>
              <Row style={{ padding: '30px', maxHeight: '400px', overflowY: 'scroll' }}>
                <Col lg={12} className='mb-3'>
                  Location
                  <select value={location} className='form-select' onChange={(e) => setLocation(e.target.value)}>
                    <option selected value="">--Select</option>
                    {locationOptions}
                  </select>
                </Col>
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
                <Col lg={12} className='mb-3'>
                  Body Type
                  <select value={body} className='form-select' onChange={(e) => setBody(e.target.value)}>
                    <option value="">--Select--</option>
                    {bodyOptions}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col lg={12} className='d-flex justify-content-end my-2 mt-3 px-4'>
                  <Button color='light' onClick={() => { window.location.href = "/vehicles/"; }}>Reset Filters</Button>
                  <Button color='dark' onClick={searchFunction}>Apply Filters</Button>
                </Col>
              </Row>
            </Container>
          </Card> : <div></div>}
        </Col> : <span></span>}

        {/* Filters */}
        <Col lg={3} style={actualFilter === false ? { display: 'none' } : {}}>
          <Card color='light' className='my-5'>
            <Container>
              <Row className='p-3'>
                <Col lg={12} className='mb-3'>
                  Location
                  <select value={location} className='form-select' onChange={(e) => setLocation(e.target.value)}>
                    <option selected value="">--Select</option>
                    {locationOptions}
                  </select>
                </Col>
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
                <Col lg={12} className='mb-3'>
                  Body Type
                  <select value={body} className='form-select' onChange={(e) => setBody(e.target.value)}>
                    <option value="">--Select--</option>
                    {bodyOptions}
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
        {loading === true ? <BaitLoading text="Loading Over 2000 Vehicles..." /> : <Col lg={9}>
          <Row>
            <Col lg={12}>
              <Row>
                <Col lg={1} md={1} sm={3} xs={3}>
                  <Dropdown isOpen={ddOpen} toggle={() => setDdopen(!ddOpen)}>
                    <DropdownToggle caret>Sort By</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => sortVehicles("milesdesc")}>Miles High to Low</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => sortVehicles("milesasc")}>Miles Low to High</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => sortVehicles("pricedesc")}>Price High to Low</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => sortVehicles("priceasc")}>Price Low to High</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => sortVehicles("yeardesc")}>Year High to Low</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => sortVehicles("yearasc")}>Year Low to High</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col lg={2} md={6} sm={6} xs={6}>
                  <h5>{vehicles.length === 8 ? "Getting More Vehicles" : vehicles.length.toString() + " Vehicles Found"}</h5>
                </Col>

              </Row>

            </Col>
            {vehicles.length > 0 ? htmlstatearray : <h4>No results found</h4>}</Row>

          {/* Pagination */}
          {vehicles.length > ITEMS_PER_PAGE && (
            <div className='d-flex justify-content-center my-4'>
              <Button id='paginationBtn' color='secondary' className='mx-1' disabled={currentPage === 1} onClick={() => goToPage(1)}>&laquo;</Button>
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
