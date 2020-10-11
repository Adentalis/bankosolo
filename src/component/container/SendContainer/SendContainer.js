import React, { Component } from "react";
import styled from "styled-components";
import Tabs from "../Tab/Tabs";
import Dropdown from "./dropdownsendmoney";
import {Container, Header, Divider,Content,} from "../Container";
import { NAVIGATION_SEND_TEXT } from "../../../constants";
import { Form, Button, FormControl } from "react-bootstrap";

const StyledContainer = styled(Container)`
  /* Special Style for Container */

`;


export const StyledButton = styled(Button)`
  /* Special Style for inner Container */
`;

export default class SendContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        txTargetAddress: "",
        txTargetAddressInvalid: true,
        txValue: "",
        txValueInvalid: true
    };
      this.handleTransaction = this.handleTransaction.bind(this);
      this.handleTxTargetChange = this.handleTxTargetChange.bind(this);
      this.handleTxValueChange = this.handleTxValueChange.bind(this);
  }

  handleTxTargetChange = (e) => {
      this.setState({ txTargetAddress: e.target.value });
      var validation = {
          isAddress: function (str) {
              var pattern = /^0x[a-f,0-9,A-F]+$/;
              return pattern.test(str); // returns a boolean
          },
      };
      if (validation.isAddress(e.target.value) && e.target.value.length == 42) {
          this.setState({ txTargetAddressInvalid: false });
      } else {
          this.setState({ txTargetAddressInvalid: true });
      }
  };

  handleTxValueChange = (e) => {
    this.setState({ txValue: e.target.value });
      var newValue = e.target.value;
      var validation = {
          isNumber: function (str) {
              var pattern = /^\d+$/;
              return pattern.test(str); // returns a boolean
          },
      };
      if (validation.isNumber(newValue)) {
          this.setState({ txValueInvalid: false });
      } else {
          this.setState({ txValueInvalid: true });
      }

  };

  handleTransaction = async () => {
    await this.sendMoney();
    this.setState({txValue: '', txValueInvalid: true, txTargetAddress: '', txTargetAddressInvalid: true})
  };

  sendMoney() {
    const { txValue } = this.state;
    const { txTargetAddress } = this.state;
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Bank;
    console.log("sendMoney " + txValue + " - " + txTargetAddress);
    contract.methods["sendMoney"].cacheSend(txTargetAddress, txValue, {
      from: drizzleState.accounts[0],
    });
  }

  render() {
    return (
      <StyledContainer>
        <Header>{NAVIGATION_SEND_TEXT}</Header>
        <Divider />
        <Content>
          <Tabs>
            <div label="Überweisung senden">
                <Form.Label>Ethereum Addresse:</Form.Label>
                <Form.Control
                    style={{ width: "100%", marginBottom: "10px" }}
                    type="address"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={this.state.txTargetAddress}
                    onChange={this.handleTxTargetChange}
                />
                <label>Betrag (wei)</label>
                <FormControl
                    style={{ width: "100%", marginBottom: "10px" }}
                    type="text"
                    placeholder="Betrag"
                    className="mr-sm-2"
                    value={this.state.txValue}
                    onChange={this.handleTxValueChange}
                />
              <Button
                  style={{
                    position: "absolute",
                    width: "calc(100% - 40px)",
                    bottom: "10px",
                  }}
                  variant="outline-light"
                  disabled={this.state.txTargetAddressInvalid || this.state.txValueInvalid}
                  onClick={this.handleTransaction}
              >
                Bestätigen
              </Button>

            </div>
            <div label="Termin (bald verfügbar)">
                <div className="test">
                  <label for="example">Datum auswählen</label>
                  <input
                    className="schriftfarbedatepicker"
                    placeholder="Select date"
                    type="date"
                    id="example"
                    class="form-control"
                  />
                </div>
                {/*
                <div
                  class="md-form md-outline input-with-post-icon timepicker"
                  darktheme="true"
                >
                  <label for="set-dark-theme">Wähle eine Uhrzeit</label>
                  <input
                    type="text"
                    id="set-dark-theme"
                    class="form-control"
                    placeholder="00:00"
                  />
                  <i class="fas fa-envelope  input-prefix"></i>
                </div>
                */}
                <div class="form-group" />
                <label for="exampleInputEmail1">Betrag </label>
                <input
                  type="betrag"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Betrag eingeben"
                />
                <Button
                    style={{
                        position: "absolute",
                        width: "calc(100% - 40px)",
                        bottom: "10px",
                    }}
                    variant="outline-light"
                    disabled={true}
                >
                    Bestätigen
                </Button>
            </div>
            <div label="Dauerauftrag (bald verfügbar)" disabled={true}>
                <div class="md-form md-outline input-with-post-icon datepicker">
                  <label for="example">Datum auswählen</label>
                  <input
                    placeholder="Select date"
                    type="date"
                    id="example"
                    class="form-control"
                  />
                </div>
                <div className="form-group" />
                <label for="exampleInputEmail1">Betrag </label>
                <input
                  type="betrag"
                  class="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Betrag eingeben"
                />
                <Dropdown style={{marginTop: "10px"}} />
                <Button
                    style={{
                        position: "absolute",
                        width: "calc(100% - 40px)",
                        bottom: "10px",
                    }}
                    variant="outline-light"
                    disabled={true}
                >
                    Bestätigen
                </Button>            </div>
          </Tabs>
        </Content>
      </StyledContainer>
    );
  }
}
