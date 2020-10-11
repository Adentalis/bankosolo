import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    color: #e6e6fa;
    background-color: #4B0082;
    border-radius: 2.5px;
    width: calc(100% - 50px);
    min-width: 400px;
    height: calc(100% - 50px);
    min-height: 560px;
    padding: 30px;
    margin: 25px 25px 25px 25px;
    -webkit-box-shadow: 0px 0px 35px -10px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 3px 35px -10px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 35px -10px rgba(0,0,0,0.75);
    @media screen and (max-width:991px) {
      width: 100%;
      margin: 0px 0px 0px 0px;
      -webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0);
      -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0);
      box-shadow: 0px 0px 0px 0px rgba(0,0,0,0);
      height: 100%;
    }
`;

export const Header = styled.h2`
    color: #E6E6FA;
`;

export const Divider = styled.hr`
    border-top: 3px solid #bbb;
`;

export const Content = styled.div`
    position: relative;
    width: 100%;    
    height: calc(100% - 80px); 
    padding: 20px;
    font-size: x-large;
    background-color: #5A1791 ;
    font-size: large;
`;
