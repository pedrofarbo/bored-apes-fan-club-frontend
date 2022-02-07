import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, connectContract } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

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
    color: var(--accent-text);
`;

export const InternalAccordionWrapper = styled.div`
    width: 100%;
    color: var(--accent-text);
    max-height: ${(props) => (props.open ? '100px' : '0')};
    margin-top: ${(props) => (props.open ? '10px' : '0')};
    transition: all 0.4s ease-in-out;
    overflow: hidden;
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
  border-radius: 100%;
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

function App() {
  const [open, setOpen] = useState(false);

  const handleAccordionClick = () => {
    setOpen(!open);
  };

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`How much you want to mint?`);
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

        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          {/* <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/bored_gif_1.gif"} />
          </s.Container> */}

          <s.SpacerLarge />

          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              padding: 24
            }}
          >
            <StyledImg

              style={{
                border: "6px dotted var(--secondary)"
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
              {data.totalSupply}/{CONFIG.MAX_SUPPLY}
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
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING" : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />

          {/* <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/bored_gif_2.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container> */}

        </ResponsiveWrapper>

        <s.SpacerMedium />

        <ResponsiveWrapper flex={1} style={{ padding: "0 50px 0 50px" }}>

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

        </ResponsiveWrapper>

        <s.SpacerMedium />

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
              APES PREVIEWS
            </s.TextTitle>

            <s.SpacerLarge />

            <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/1.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/2.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/3.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/4.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>
            </ResponsiveWrapper>

            <s.SpacerLarge />

            <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/5.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/6.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/7.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/8.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>
            </ResponsiveWrapper>

            <s.SpacerLarge />

            <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/9.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/10.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/11.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/apes_preview/12.png"}
                  style={{ transform: "scaleX(-1)" }}
                />
              </s.Container>
            </ResponsiveWrapper>

          </s.Container>

        </ResponsiveWrapper>

        <s.SpacerMedium />

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
              THE TEAM
            </s.TextTitle>

            <s.SpacerLarge />

            <ResponsiveWrapper flex={1} style={{ padding: 0 }}>
              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/monkey1.png"}
                  style={{ transform: "scaleX(-1)" }}
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
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/monkey2.png"}
                  style={{ transform: "scaleX(-1)" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  Community Manager
                </s.TextDescription>
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/monkey3.png"}
                  style={{ transform: "scaleX(-1)" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  Artist
                </s.TextDescription>
              </s.Container>

              <s.Container flex={1} jc={"center"} ai={"center"}>
                <StyledImg
                  alt={"example"}
                  src={"/config/images/monkey4.png"}
                  style={{ transform: "scaleX(-1)" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  The Investor
                </s.TextDescription>
              </s.Container>
            </ResponsiveWrapper>

          </s.Container>

        </ResponsiveWrapper>

        <s.SpacerMedium />

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
                  style={{ transform: "scaleX(-1)", width: "100px" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  DISCORD

                </s.TextDescription>

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
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
                  style={{ transform: "scaleX(-1)", width: "100px" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  TWITTER
                </s.TextDescription>

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
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
                  style={{ transform: "scaleX(-1)", width: "100px" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  INSTAGRAM
                </s.TextDescription>

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
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
                  style={{ transform: "scaleX(-1)", width: "100px" }}
                />

                <s.SpacerMedium />

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  OPEN SEA

                </s.TextDescription>

                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                  }}
                >

                  @Bored Apes Fan Club
                </s.TextDescription>
              </s.Container>
            </ResponsiveWrapper>

          </s.Container>

        </ResponsiveWrapper>

        <s.SpacerMedium />

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
                              textAlign: "justify",
                              color: "var(--primary)",
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
                              textAlign: "justify",
                              color: "var(--primary)",
                            }}
                          >

                            II - What is Metamask?
                          </s.TextDescription>

                          <InternalAccordionWrapper open={open}>
                            Metamask is a crypto-wallet that can store your Ethereum, and is needed to purchase and mint a Baby Ghost. Having a wallet gives you an Ethereum address (i.e. 0xSPOO….666), this is where your NFT will be stored. Learn more about Metamask and how easy it is to use over here! (https://metamask.io).
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
                              textAlign: "justify",
                              color: "var(--primary)",
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
                              textAlign: "justify",
                              color: "var(--primary)",
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

      <s.SpacerLarge />
    </s.Screen>
  );
}

export default App;
