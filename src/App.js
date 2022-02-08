import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { useTable } from "react-table";
import Slider from 'react-styled-carousel';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 25px;
  font-size: 20px;
  font-weight: 700;
  border-radius: 50px;
  border: 4px dotted var(--btn-border);
  background-color: var(--btn-bg);
  color: var(--btn-text);
  width: auto;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 30px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const AccordionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: var(--secondary);
    border-radius: 10px;
    height: auto;
    padding: 2%;
    text-align: center;
    width: 100%;
    transition: all 0.6s ease-in-out;
    font-family: unset;
    font-size: 13px;
    font-weight: 500;
`;

export const InternalAccordionWrapper = styled.div`
    width: 100%;
    color: var(--accent-text);
    max-height: ${(props) => (props.open ? '100px' : '0')};
    margin-top: ${(props) => (props.open ? '10px' : '0')};
    transition: all 0.4s ease-in-out;
    overflow: hidden;
    font-family: unset;
    font-size: 13px;
    font-weight: 400;
`;

export const StyledLogo = styled.img`
  width: 100%;
  border-bottom: 2px solid var(--secondary);
  @media (min-width: 767px) {
    width: 100%;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const Line = styled.div`
  position: relative;
  max-width: 1380px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center !important;
  align-items: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
`;

export const Menu = styled.div`
  position: relative;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 70%;

  @media (max-width: 1315px) {
    display: none;
  }
`;

export const MenuLinks = styled.div`
  list-style: none;
  display: flex;
  justify-content: flex-end;
  width: 30%;
`;

export const MenuMobileLinks = styled.div`
  list-style: none;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-left: -10px;
`;

export const MenuMobile = styled.div`
  position: relative;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 0 0 100px;

  @media (min-width: 1315px) {
    display: none;
  }
`;

export const BtnMenuMobile = styled.div`
  position: relative;
  background: transparent;
  cursor: pointer;
`;

export const MenuMobileInternal = styled.div`
  height: auto;
  width: 200px;
  position: relative;
  background: transparent;
  display: flex;
  flex-direction: column;
  font-family: 'airstrike';
`;

export const TraitsTableStyles = styled.div`
 table {
   border-spacing: 0;
   border: 2px solid var(--secondary);
   background: transparent;
   width: 480px;
   font-weight: bold;
   color: var(--primary-text);
   border-collapse:separate;
    -webkit-border-radius: 6px;
       -moz-border-radius: 6px;
            border-radius: 6px;

   tr {
    fontWeight: bold;
    :last-child {
       td {
         border-bottom: 0;
         font-weight: 400;
       }
     }
   }

   th,
   td {
     padding: 0.5rem;
     border-bottom: 1px solid var(--secondary);
     border-right: 1px solid var(--secondary);
     font-weight: 400;
     text-align: center;

     :first-child {
        text-align:left;
      }

     :last-child {
       border-right: 0;
     }
   }
  
   th {
     background: var(--secondary);
     border-bottom: 3px solid var(--secondary);
     color: var(--primary-text);
     font-weight: bold;
     text-align:center !important;
   }
 }
`

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function ApesPreviewSlider() {
  return (
    <Slider style={{ width: "100%", maxWidth: "1900px" }} showDots={false} infinite={true} showArrows={false} padding={"0"} margin={"0"} autoSlide={1600} cardsToShow={6}>

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/1.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/2.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/3.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/4.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/5.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/6.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/7.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/8.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/9.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/10.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/11.png"}
      />

      <StyledImg
        alt={"example"}
        src={"/config/images/apes_preview/12.png"}
      />
    </Slider>
  )
}

function App() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const traits = React.useMemo(() =>
    [
      {
        trait: 'Background',
        common: '9',
        uncommon: '9',
        rare: '9',
      },
      {
        trait: 'Furs',
        common: '10',
        uncommon: '10',
        rare: '10',
      },
      {
        trait: 'Hats',
        common: '19',
        uncommon: '17',
        rare: '12',
      },
      {
        trait: 'Clothes',
        common: '29',
        uncommon: '23',
        rare: '18',
      },
      {
        trait: 'Eyes',
        common: '13',
        uncommon: '13',
        rare: '11',
      },
      {
        trait: 'Mouths',
        common: '18',
        uncommon: '14',
        rare: '13',
      },
      {
        trait: 'Decorations',
        common: '-',
        uncommon: '20',
        rare: '-',
      },
    ],
    []
  )

  const traitsTableCollums = React.useMemo(
    () => [
      {
        Header: 'Trait',
        accessor: 'trait',
      },
      {
        Header: 'Common',
        accessor: 'common',
      },
      {
        Header: 'Uncommon',
        accessor: 'uncommon',
      },
      {
        Header: 'Rare',
        accessor: 'rare',
      },
    ],
    []
  )

  const handleAccordionClick = () => {
    setOpen(!open);
  };

  const handleMenuMobileClick = () => {
    setMenuOpen(!menuOpen);
  };

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`How many you want to mint?`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }

    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const goTo = (where) => {
    if (where === 'discord') {
      window.open('https://discord.gg/u7AgwTFC', '_blank');
    } else if (where === 'twitter') {
      window.open('https://twitter.com/ApesFun', '_blank');
    } else if (where === 'instagram') {
      window.open('https://www.instagram.com/bored_apes_fc/', '_blank');
    } else if (where === 'opensea') {
      window.open("https://opensea.io/collection/bored-apes-fan-club", '_blank');
    } else {
      //Nothing
    }
  }

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 0, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >

        <a href={CONFIG.MARKETPLACE_LINK}>
          <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        </a>

        <s.SpacerLarge />
        <s.SpacerLarge />

        <Line>
          <Menu>
            <ul className="menu-ul">
              <li className="menu-li"><a href="/#about"><span>About the BAFC</span></a></li>
              <li className="division"> / </li>
              <li className="menu-li"><a href="/#apes"><span>Apes Previews</span></a></li>
              <li className="division"> / </li>
              <li className="menu-li"><a href="/#traits"><span>Traits</span></a></li>
              <li className="division"> / </li>
              <li className="menu-li"><a href="/#team"><span>The Team</span></a></li>
              <li className="division"> / </li>
              <li className="menu-li"><a href="/#links-faq"><span>Links</span></a></li>
              <li className="division"> / </li>
              <li className="menu-li"><a href="/#links-faq"><span>Faq</span></a></li>
            </ul>

            <MenuLinks className="menuLinks" style={{ cursor: "pointer" }}>
              <StyledImg
                alt={"discord"}
                src={"/config/images/ico-discord.svg"}
                style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                  e.preventDefault();
                  goTo("discord");
                }}
              />

              <StyledImg
                alt={"twitter"}
                src={"/config/images/ico-twitter.svg"}
                style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                  e.preventDefault();
                  goTo("twitter");
                }}
              />

              <StyledImg
                alt={"instagram"}
                src={"/config/images/ico-instagram.svg"}
                style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                  e.preventDefault();
                  goTo("instagram");
                }}
              />
            </MenuLinks>
          </Menu>

          <MenuMobile>
            <BtnMenuMobile onClick={(e) => {
              e.preventDefault();
              handleMenuMobileClick();
            }}>
              
              {!menuOpen ?  <StyledImg
                alt={"open"}
                src={"/config/images/menu.png"}
                style={{ width: "28px", height: "100%"}} onClick={(e) => {
                  e.preventDefault();
                  handleMenuMobileClick();
                }} /> : <StyledImg
                alt={"close"}
                src={"/config/images/close.png"}
                style={{ width: "32px", height: "100%"}} onClick={(e) => {
                  e.preventDefault();
                  handleMenuMobileClick();
                }} />}
             
              </BtnMenuMobile>

              <s.SpacerXSmall />
              
              {
                menuOpen ?  <MenuMobileInternal>
             
              <a className="menuMobileLink" href="/#about"><span>About the BAFC</span></a>
              <a className="menuMobileLink" href="/#apes"><span>Apes Previews</span></a>
              <a className="menuMobileLink" href="/#traits"><span>Traits</span></a>
              <a className="menuMobileLink" href="/#team"><span>The Team</span></a>
              <a className="menuMobileLink" href="/#links-faq"><span>Links</span></a>
              <a className="menuMobileLink" href="/#links-faq"><span>Faq</span></a>

              <s.SpacerLarge />

              <MenuMobileLinks className="menuLinks" style={{ cursor: "pointer" }}>
                <StyledImg
                  alt={"discord"}
                  src={"/config/images/ico-discord.svg"}
                  style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                    e.preventDefault();
                    goTo("discord");
                  }}
                />

                <StyledImg
                  alt={"twitter"}
                  src={"/config/images/ico-twitter.svg"}
                  style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                    e.preventDefault();
                    goTo("twitter");
                  }}
                />

                <StyledImg
                  alt={"instagram"}
                  src={"/config/images/ico-instagram.svg"}
                  style={{ width: "22px", height: "100%", margin: "0 6px" }} onClick={(e) => {
                    e.preventDefault();
                    goTo("instagram");
                  }}
                />
            </MenuMobileLinks>
 
              </MenuMobileInternal> : null
              }
              
              
          </MenuMobile>

          
        </Line>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <ResponsiveWrapper flex={1} style={{ padding: "0 50px 0 50px" }}>

            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                ABOUT THE BAFC
            </s.TextTitle>

              <s.TextDescription
                style={{
                  textAlign: "justify",
                  color: "var(--accent-text)",
                }}
              >

                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel egestas lectus. Suspendisse sem ante, ultrices eu mi eu, dapibus aliquam nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean molestie ultrices lacus. Maecenas risus diam, ultricies in gravida ac, posuere in velit. Mauris vulputate ullamcorper leo, ut rhoncus nisi sodales at. Integer ut quam sollicitudin ipsum commodo lobortis eu nec libero.
            </s.TextDescription>

              <s.SpacerSmall />

              <s.TextDescription
                style={{
                  textAlign: "justify",
                  color: "var(--accent-text)",
                }}
              >

                Quisque faucibus neque porta ligula suscipit, fringilla aliquet lorem fermentum. Aenean sit amet odio ex. Sed in lectus in massa viverra varius. Sed dapibus tincidunt scelerisque. Curabitur tempor urna et mauris molestie, vel iaculis arcu rhoncus. Sed nec dolor eget ligula sodales gravida id vitae nisi. Nunc eget ipsum non ante finibus gravida quis et risus. Phasellus ac risus at lectus egestas faucibus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc felis dolor, cursus nec magna ut, ullamcorper aliquet turpis. Vivamus nec felis nec leo auctor viverra sed nec dui. Donec viverra dolor in fringilla viverra. Donec porttitor diam at purus molestie, placerat faucibus odio congue.
            </s.TextDescription>

            </s.Container>

            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                padding: 0
              }}
            >
              <StyledImg

                style={{
                  border: "6px dotted var(--secondary)",
                  borderRadius: "100%"
                }}

                alt={"Bored Apes Preview"} src={"./logo512.png"} />

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                {/* {data.totalSupply}/{CONFIG.MAX_SUPPLY} */}
                0/10000
            </s.TextTitle>

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                  marginTop: "-20px",
                  fontFamily: "airstrike"
                }}
              >
                MINTED
            </s.TextTitle>

              <s.SpacerSmall />

              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    The sale has ended.
                </s.TextTitle>

                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                  <>
                    {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>

                          <StyledButton
                            style={{ fontFamily: "airstrike" }}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            CONNECT WALLET
                    </StyledButton>

                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                }}
                              >
                                {blockchain.errorMsg}
                              </s.TextDescription>
                            </>
                          ) : null}
                        </s.Container>
                      ) : (
                        <>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {feedback}
                          </s.TextDescription>

                          <s.SpacerMedium />

                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                      </StyledRoundButton>

                            <s.SpacerMedium />

                            <s.TextDescription
                              style={{
                                textAlign: "center",
                                color: "var(--accent-text)",
                                fontWeight: "bold",
                              }}
                            >
                              {mintAmount}
                            </s.TextDescription>

                            <s.SpacerMedium />

                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                      </StyledRoundButton>
                          </s.Container>
                          <s.SpacerSmall />
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                              style={{ fontFamily: "airstrike" }}
                              // disabled={claimingNft ? 1 : 0}
                              disabled={true}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {/* {claimingNft ? "MINTING" : "MINT"} */}
                              New round soon.. Stay tuned!
                      </StyledButton>
                          </s.Container>
                        </>
                      )}
                  </>
                )}
              <s.SpacerMedium />
            </s.Container>

          </ResponsiveWrapper>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <ResponsiveWrapper id="apes" flex={1} style={{ padding: "0 50px 0 50px" }}>

            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                APES PREVIEWS
            </s.TextTitle>

              <s.SpacerLarge />

              <ApesPreviewSlider />

            </s.Container>

          </ResponsiveWrapper>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <ResponsiveWrapper id="team" flex={1} style={{ padding: "0 50px 0 50px" }}>

            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                THE TEAM
            </s.TextTitle>

              <s.SpacerLarge />

              <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                <s.Container flex={1} jc={"center"} ai={"center"}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/monkey1.png"}

                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    Project Founder
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    Ketaros
                </s.TextDescription>

                  <StyledImg
                    alt={"discord"}
                    src={"/config/images/discord.png"}
                    style={{ cursor: "pointer", width: "32px" }} onClick={(e) => {
                      e.preventDefault();
                      window.open('https://discord.gg/', '_blank');
                    }}
                  />
                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/monkey2.png"}

                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    Developer
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    FarTeck
                </s.TextDescription>

                  <StyledImg
                    alt={"discord"}
                    src={"/config/images/discord.png"}
                    style={{ cursor: "pointer", width: "32px" }} onClick={(e) => {
                      e.preventDefault();
                      window.open('https://discord.gg/', '_blank');
                    }}
                  />
                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/monkey3.png"}

                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    The Artist
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >

                    Rob_Tasker
                </s.TextDescription>

                  <StyledImg
                    alt={"discord"}
                    src={"/config/images/discord.png"}
                    style={{ cursor: "pointer", width: "32px" }} onClick={(e) => {
                      e.preventDefault();
                      window.open('https://discord.gg/', '_blank');
                    }}
                  />
                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/monkey4.png"}

                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)"
                    }}
                  >

                    The Investor
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)"
                    }}
                  >

                    Margot_IK
                </s.TextDescription>

                  <StyledImg
                    alt={"discord"}
                    src={"/config/images/discord.png"}
                    style={{ cursor: "pointer", width: "32px" }} onClick={(e) => {
                      e.preventDefault();
                      window.open('https://discord.gg/', '_blank');
                    }}
                  />
                </s.Container>
              </ResponsiveWrapper>

            </s.Container>

          </ResponsiveWrapper>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <ResponsiveWrapper id="traits" flex={1} style={{ padding: "0 50px 0 50px" }}>

            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                TRAITS
            </s.TextTitle>

              <s.SpacerLarge />

              <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                <s.Container flex={1} jc={"center"} ai={"center"}>
                  <TraitsTableStyles>
                    <Table columns={traitsTableCollums} data={traits}></Table>
                  </TraitsTableStyles>
                </s.Container>
              </ResponsiveWrapper>

            </s.Container>

          </ResponsiveWrapper>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <ResponsiveWrapper id="links-faq" flex={1} style={{ padding: "0 50px 0 50px" }}>

            <s.Container
              flex={1}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                LINKS
            </s.TextTitle>

              <s.SpacerLarge />

              <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                <s.Container flex={1} jc={"center"} ai={"center"} style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo('discord');
                  }}>

                  <StyledImg
                    alt={"discord"}
                    src={"/config/images/discord.png"}
                    style={{ transform: "scaleX(-1)", width: "45px" }}
                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '14px'
                    }}
                  >

                    DISCORD
  
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '12px'
                    }}
                  >

                    @u7AgwTFC
                </s.TextDescription>

                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"} style={{ cursor: "pointer" }} onClick={(e) => {
                  e.preventDefault();
                  goTo('twitter');
                }}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/twitter.png"}
                    style={{ transform: "scaleX(-1)", width: "45px" }}
                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '14px'
                    }}
                  >

                    TWITTER
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '12px'
                    }}
                  >

                    @ApesFun
                </s.TextDescription>
                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"} style={{ cursor: "pointer" }} onClick={(e) => {
                  e.preventDefault();
                  goTo('instagram');
                }}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/instagram.png"}
                    style={{ transform: "scaleX(-1)", width: "45px" }}
                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '14px'
                    }}
                  >

                    INSTAGRAM
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '12px'
                    }}
                  >

                    @bored_apes_fc
                </s.TextDescription>
                </s.Container>

                <s.Container flex={1} jc={"center"} ai={"center"} style={{ cursor: "pointer" }} onClick={(e) => {
                  e.preventDefault();
                  goTo('opensea');
                }}>
                  <StyledImg
                    alt={"example"}
                    src={"/config/images/opensea.png"}
                    style={{ transform: "scaleX(-1)", width: "45px" }}
                  />

                  <s.SpacerMedium />

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '14px'
                    }}
                  >

                    OPEN SEA
  
                </s.TextDescription>

                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                      fontSize: '12px'
                    }}
                  >

                    @Bored Apes Fan Club
                </s.TextDescription>
                </s.Container>
              </ResponsiveWrapper>

            </s.Container>

            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                padding: "0 50px 0 50px"
              }}
            >

              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: "4rem",
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}
              >
                FAQ
            </s.TextTitle>

              <ul>
                <li style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.preventDefault();
                  handleAccordionClick();
                }}>
                  <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                    <s.Container
                      flex={1}
                      jc={"center"}
                      ai={"center"}
                      style={{
                        padding: 0
                      }}
                    >

                      <AccordionWrapper>

                        <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                          <s.Container
                            flex={11}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <s.TextDescription
                              style={{
                                textAlign: "justify"
                              }}
                            >

                              I - What is NFT?
                          </s.TextDescription>

                            <InternalAccordionWrapper open={open}>
                              NFT stands for “Non-fungible token” and is a cool way of saying it's a truly unique digital item that YOU can buy, own, and trade.
                          </InternalAccordionWrapper>

                          </s.Container>

                          <s.Container
                            flex={1}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <StyledRoundButton
                              onClick={(e) => {
                                e.preventDefault();
                                handleAccordionClick();
                              }}
                            >
                              {!open ? '+' : '-'}
                            </StyledRoundButton>


                          </s.Container>
                        </ResponsiveWrapper>
                      </AccordionWrapper>

                    </s.Container>

                  </ResponsiveWrapper>

                </li>

                <s.SpacerSmall />

                <li style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.preventDefault();
                  handleAccordionClick();
                }}>
                  <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                    <s.Container
                      flex={1}
                      jc={"center"}
                      ai={"center"}
                      style={{
                        padding: 0
                      }}
                    >

                      <AccordionWrapper>

                        <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                          <s.Container
                            flex={11}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <s.TextDescription
                              style={{
                                textAlign: "justify"
                              }}
                            >

                              II - What is Metamask?
                          </s.TextDescription>

                            <InternalAccordionWrapper open={open}>
                              Metamask is a crypto-wallet that can store your Ethereum, and is needed to purchase and mint a Bored Apes. Having a wallet gives you an Ethereum address (i.e. 0xSPOO….666), this is where your NFT will be stored. Learn more about Metamask and how easy it is to use over here! (https://metamask.io).
                          </InternalAccordionWrapper>

                          </s.Container>

                          <s.Container
                            flex={1}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <StyledRoundButton
                              onClick={(e) => {
                                e.preventDefault();
                                handleAccordionClick();
                              }}
                            >
                              {!open ? '+' : '-'}
                            </StyledRoundButton>


                          </s.Container>
                        </ResponsiveWrapper>
                      </AccordionWrapper>

                    </s.Container>

                  </ResponsiveWrapper>

                </li>

                <s.SpacerSmall />

                <li style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.preventDefault();
                  handleAccordionClick();
                }}>
                  <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                    <s.Container
                      flex={1}
                      jc={"center"}
                      ai={"center"}
                      style={{
                        padding: 0
                      }}
                    >

                      <AccordionWrapper>

                        <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                          <s.Container
                            flex={11}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <s.TextDescription
                              style={{
                                textAlign: "justify"
                              }}
                            >

                              III - How to mint with Metamask on a mobile phone?
                          </s.TextDescription>

                            <InternalAccordionWrapper open={open}>
                              If you are using a mobile phone to mint our Bored Apes, you need to use the Metamask application built-in browser to mint our NFTs. Therefore, please launch the Metamask application, click the 3 lines on the top left menu in the application and select "Browser". It will open a web browser and you will be able to navigate back to bafc.fun to do the minting.
                          </InternalAccordionWrapper>

                          </s.Container>

                          <s.Container
                            flex={1}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <StyledRoundButton
                              onClick={(e) => {
                                e.preventDefault();
                                handleAccordionClick();
                              }}
                            >
                              {!open ? '+' : '-'}
                            </StyledRoundButton>


                          </s.Container>
                        </ResponsiveWrapper>
                      </AccordionWrapper>

                    </s.Container>

                  </ResponsiveWrapper>

                </li>

                <s.SpacerSmall />

                <li style={{ cursor: 'pointer' }} onClick={(e) => {
                  e.preventDefault();
                  handleAccordionClick();
                }}>
                  <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                    <s.Container
                      flex={1}
                      jc={"center"}
                      ai={"center"}
                      style={{
                        padding: 0
                      }}
                    >

                      <AccordionWrapper>

                        <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
                          <s.Container
                            flex={11}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <s.TextDescription
                              style={{
                                textAlign: "justify"
                              }}
                            >

                              IV - How to mint with Metamask on a computer?
                          </s.TextDescription>

                            <InternalAccordionWrapper open={open}>
                              If you are using a computer to mint our Bored Apes, you just need to connect the Metamask plugin with our website, verify you have enough ETH to do the transaction, then you will be able to click on the Mint button to buy a few Apes.
                          </InternalAccordionWrapper>

                          </s.Container>

                          <s.Container
                            flex={1}
                            jc={"center"}
                            ai={"center"}
                            style={{
                              padding: 0
                            }}
                          >

                            <StyledRoundButton
                              onClick={(e) => {
                                e.preventDefault();
                                handleAccordionClick();
                              }}
                            >
                              {!open ? '+' : '-'}
                            </StyledRoundButton>


                          </s.Container>
                        </ResponsiveWrapper>
                      </AccordionWrapper>

                    </s.Container>

                  </ResponsiveWrapper>

                </li>
              </ul>
            </s.Container>

          </ResponsiveWrapper>

          <s.SpacerLarge />
          <s.SpacerLarge />

          <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
              Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
            <s.SpacerSmall />
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
              successfully mint your NFT. We recommend that you don't lower the
              gas limit.
          </s.TextDescription>
          </s.Container>
      </s.Container>

        <s.SpacerLarge /><s.SpacerLarge />
    </s.Screen>
      );
    }
    
    export default App;
