import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { Nav, Navbar, NavDropdown} from 'react-bootstrap';
import { NAVIGATION_MESSAGE_PATH, NAVIGATION_SEND_PATH, NAVIGATION_FREEZE_MONEY_PATH,NAVIGATION_FREEZE_CONTRACT_PATH,  NAVIGATION_MESSAGE_TEXT, NAVIGATION_SEND_TEXT, NAVIGATION_FREEZE_MONEY_TEXT,NAVIGATION_FREEZE_CONTRACT_TEXT} from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import image from "../Bankosolo.png";

const Style = styled.div`
.navbar { 
  background-color: #4B0082; 
  color: #E6E6FA;
}
a, 
.navbar-light 
.nav-link {
  color: #E6E6FA;
  &:hover, &:focus, &:active { color: white; }
}
.navbar-brand {
  font-size: 1.4em;
  color: #E6E6FA;
  &:hover { color: white; }
}
.LogoBankoSolo{
  font-size: 7vh:
  font-weight: bold: 
  text-shadow: 3px; 
}
.form-center {
  position: absolute !important;
  left: 25%;
  right: 25%;
}
`;


class NavigationBar extends Component {

  state = {
    account: null,
    accountBalances: null,
    network: null
  };


  componentDidMount = () => {
    const {drizzle} = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
        const drizzleState = drizzle.store.getState();

        if(drizzleState.drizzleStatus.initialized) {
            this.setState({
                account: this.props.drizzleState.accounts[0],
                balance: this.props.drizzleState.accountBalances[this.props.drizzleState.accounts[0]],
            });
        }
    });
  }

  componentWillUnmount = () => {
    this.unsubscribe();
  }

  getAccount = () => {
    let account = this.state.account;
    return account;
  }

  getBalance = () => {
    let balance = this.state.balance;
    return balance / 1000000000000000000;
  }

  render() {
    return (
      <Style>
        <Navbar collapseOnSelect expand="lg">
          <Navbar.Brand >
          <img src={image} style={{width: 190, height: 45}} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Item><Link className="nav-link" to={"/" + NAVIGATION_SEND_PATH}>{NAVIGATION_SEND_TEXT}</Link></Nav.Item>
              <Nav.Item><Link className="nav-link" to={"/" + NAVIGATION_FREEZE_MONEY_PATH}>{NAVIGATION_FREEZE_MONEY_TEXT}</Link></Nav.Item>
              <Nav.Item><Link className="nav-link" to={"/" + NAVIGATION_FREEZE_CONTRACT_PATH}>{NAVIGATION_FREEZE_CONTRACT_TEXT}</Link></Nav.Item>
              <Nav.Item><Link className="nav-link" to={"/" + NAVIGATION_MESSAGE_PATH}>{NAVIGATION_MESSAGE_TEXT}</Link></Nav.Item>

            </Nav>
            <Nav className="ml-auto">
              <NavDropdown.Divider />
              <div>
              <FontAwesomeIcon icon={faUser} style={{display: "inline-block", marginRight: "10px", marginLeft: "10px"}}/>
                <Nav.Item style={{display: "inline-block"}}> {this.getAccount()} </Nav.Item>
              </div>
              <div>
                <FontAwesomeIcon icon={faUser} style={{display: "inline-block", marginRight: "10px", marginLeft: "10px"}}/>
                <Nav.Item style={{display: "inline-block"}}> {this.getBalance()} ETH</Nav.Item>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Style>
    );
  }
}
export default NavigationBar;