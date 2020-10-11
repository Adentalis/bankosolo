import React, { Component } from "react";
import { Container, Header, Divider, Content } from "../Container";
import { NAVIGATION_FREEZE_MONEY_TEXT } from "../../../constants";
import { Button, Form, FormControl } from "react-bootstrap";
import Tabs from "../Tab/Tabs";

export default class FreezeMoneyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      freezeValue: "",
      freezeValueInvalid: true,

      freezeTime: "",
      freezeTimeInvalid: true,

      freezeMessage: "",
      freezeMessageInvalid: true,

      transactionValue: "",

      getFreezeTransactionKey: [],
    };
    this.handleFreezeValueChange = this.handleFreezeValueChange.bind(this);
    this.handleFreezeTimeChange = this.handleFreezeTimeChange.bind(this);
    this.handleFreezeMessageChange = this.handleFreezeMessageChange.bind(this);
    this.submitFreezeTransaction = this.submitFreezeTransaction.bind(this);

    this.getNowFormatet = this.getNowFormatet.bind(this);
    this.sortFreezeTransactionsByReleaseDate = this.sortFreezeTransactionsByReleaseDate.bind(
      this
    );
    this.MAXIMUM_FREEZE_TRANSACTIONS = 5;
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Bank;

    //init the 5 FreezeTransactions
    let getFreezeTransactionKey = [];
    for (let i = 0; i < this.MAXIMUM_FREEZE_TRANSACTIONS; i++) {
      getFreezeTransactionKey[i] = contract.methods[
        "getFreezeTransaction"
      ].cacheCall(i);
    }
    this.setState({ getFreezeTransactionKey });
  }

  handleFreezeValueChange(e) {
    this.setState({ freezeValue: e.target.value });
    var newValue = e.target.value;
    var validation = {
      isNumber: function (str) {
        var pattern = /^\d+$/;
        return pattern.test(str); // returns a boolean
      },
    };
    if (validation.isNumber(newValue)) {
      this.setState({ freezeValueInvalid: false });
    } else {
      this.setState({ freezeValueInvalid: true });
    }
  }

  handleFreezeTimeChange(e) {
    this.setState({ freezeTime: e.target.value });
    if (e.target.value.length > 0) {
      this.setState({ freezeTimeInvalid: false });
    } else {
      this.setState({ freezeTimeInvalid: true });
    }
  }

  handleFreezeMessageChange(e) {
    this.setState({ freezeMessage: e.target.value });
    if (e.target.value.length > 0) {
      this.setState({ freezeMessageInvalid: false });
    } else {
      this.setState({ freezeMessageInvalid: true });
    }
  }

  submitFreezeTransaction() {
    var selectedTime = new Date(this.state.freezeTime).getTime() / 1000;
    this.createFreezeTranaction(
      this.state.freezeValue,
      selectedTime,
      this.state.freezeMessage
    );

    this.setState({
      freezeMessage: "",
      freezeMessageInvalid: true,
      freezeValue: "",
      freezeValueInvalid: true,
      freezeTime: "",
      freezeTimeInvalid: true,
    });
  }

  async createFreezeTranaction(value, selectedTime, message) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Bank;
    contract.methods["createFreezeTranaction"].cacheSend(
      selectedTime,
      value,
      message,
      {
        from: drizzleState.accounts[0],
      }
    );
  }

  getNowFormatet() {
    var today = new Date();
    var tomorrow = new Date(today);
    //tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setDate(tomorrow.getDate());

    var dd = tomorrow.getDate();

    var mm = tomorrow.getMonth() + 1;
    var yyyy = tomorrow.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }
    tomorrow = yyyy + "-" + mm + "-" + dd;
    return tomorrow;
  }

  sortFreezeTransactionsByReleaseDate(freezeTransactions) {
    return freezeTransactions.sort((freezeTransactionA, freezeTransactionB) => {
      return freezeTransactionA.value[0] - freezeTransactionB.value[0];
    });
  }

  createFreezeTransactionContent() {
    const { Bank } = this.props.drizzleState.contracts;

    //load all 5 tx from the SC
    const allFreezeTransactions = [];
    for (let i = 0; i < this.MAXIMUM_FREEZE_TRANSACTIONS; i++) {
      allFreezeTransactions[i] =
        Bank.getFreezeTransaction[this.state.getFreezeTransactionKey[i]];
    }
    //check if all 5 rx loaded succesfully
    if (this.allFreezeTransactionsLoaded(allFreezeTransactions)) {
      //set index of position loaded - needed for accepting
      for (let i = 0; i < this.MAXIMUM_FREEZE_TRANSACTIONS; i++) {
        allFreezeTransactions[i].index = i;
      }

      //filter the empty ones
      let filledFreezeTransaction = allFreezeTransactions.filter(
        (freezeTransaction) => freezeTransaction.value[1] !== "0"
      );

      //sort by date
      filledFreezeTransaction = this.sortFreezeTransactionsByReleaseDate(
        filledFreezeTransaction
      );

      return filledFreezeTransaction.map((freezeTransaction, index) => (
        <div key={index}>
          <hr
            style={
              index != 0
                ? { borderTop: "3px solid #bbb" }
                : { borderTop: "0px solid #bbb" }
            }
          />
          <div>
            <div>
              <b>Zweck</b>
            </div>
            <div
              style={{
                paddingLeft: "10px",
                width: "100%",
                overflow: "visible",
              }}
            >
              {freezeTransaction.value[2]}
            </div>
          </div>
          <div>
            <div>
              <b>Betrag</b>
            </div>
            <div style={{ paddingLeft: "10px", width: "100%" }}>
              {freezeTransaction.value[1]} wei
            </div>
          </div>
          <div>
            <div>
              <b>Freischaltdatum</b>
            </div>
            {this.isFreezeTransactionTimeOver(freezeTransaction)}
          </div>
        </div>
      ));
    }
  }

  isFreezeTransactionTimeOver(freezeTransaction) {
    let txEnd = parseInt(freezeTransaction.value[0]) - 3600;
    let now = new Date().getTime() / 1000;
    if (now - txEnd < 0) {
      return (
        <div style={{ paddingLeft: "10px", width: "100%" }}>
          {new Date(
            1000 * parseInt(freezeTransaction.value[0]) - 3600000
          ).toLocaleString().slice(0, 9)}
        </div>
      );
    } else {
      return (
        <Button
          style={{
            width: "calc(100% - 40px)",
            bottom: "10px",
          }}
          variant="outline-light"
          onClick={() => this.finishFreezeTranaction(freezeTransaction)}
        >
          Geld abholen
        </Button>
      );
    }
  }

  async finishFreezeTranaction(freezeTranaction) {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.Bank;
    contract.methods[
      "finishFreezeTransaction"
    ].cacheSend(freezeTranaction.index, { from: drizzleState.accounts[0] });
  }

  allFreezeTransactionsLoaded(lastFreezeTransaction) {
    for (let i = 0; i < this.MAXIMUM_FREEZE_TRANSACTIONS; i++) {
      if (lastFreezeTransaction[i] === undefined) return false;
    }
    return true;
  }

  render() {
    this.getNowFormatet();
    return (
      <Container>
        <Header>{NAVIGATION_FREEZE_MONEY_TEXT}</Header>
        <Divider />
        <Content>
          <Tabs>
            <div label="Neu">
              <label>Welchen Betrag möchten Sie zurücklegen? (wei)</label>
              <FormControl
                style={{ width: "100%", marginBottom: "10px" }}
                type="text"
                placeholder="100000000 wei"
                className="mr-sm-2"
                value={this.state.freezeValue}
                onChange={this.handleFreezeValueChange}
              />
              <label>Bis wann möchten Sie diesen Betrag zurücklegen?</label>
              <input
                style={{ width: "100%", marginBottom: "10px" }}
                placeholder="Select date"
                type="date"
                class="form-control"
                min={this.getNowFormatet()}
                value={this.state.freezeTime}
                onChange={this.handleFreezeTimeChange}
              />
              <label>Zweck</label>
              <FormControl
                style={{ width: "100%", marginBottom: "10px" }}
                type="text"
                placeholder="Sparen für schlechte Zeiten"
                className="mr-sm-2"
                value={this.state.freezeMessage}
                onChange={this.handleFreezeMessageChange}
              />
              <Button
                style={{
                  position: "absolute",
                  width: "calc(100% - 40px)",
                  marginTop: "10px",
                }}
                variant="outline-light"
                disabled={
                  this.state.freezeValueInvalid ||
                  this.state.freezeTimeInvalid ||
                  this.state.freezeMessageInvalid
                }
                onClick={this.submitFreezeTransaction}
              >
                Zurücklegen
              </Button>
            </div>
            <div label="Zurückgelegte Beträge">
              <div
                style={{
                  width: "calc(100% - 40px)",
                  height: "calc(100% - 100px)",
                  overflow: "auto",
                  position: "absolute",
                }}
              >
                {this.createFreezeTransactionContent()}
              </div>
            </div>
          </Tabs>
        </Content>
      </Container>
    );
  }
}
