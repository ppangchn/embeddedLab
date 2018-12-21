import React, { Component } from 'react';
import { Navbar, Nav, NavLink } from 'reactstrap';
import {withRouter} from 'react-router-dom'
import '../css/Header.css'
class Header extends Component {
    constructor() {
        super()
        this.state = ({homeBold:'',editBold:''})
    }
    handleHome() {
        this.clear()
        this.setState({homeBold:'bold'})
        this.props.history.push("/")
    }
    handleEdit() {
        this.clear()
        this.setState({editBold:'bold'})
        this.props.history.push("/edit")
    }
   setCurrentTitle() {
       const {pathname} = this.props.location
       if (pathname === "/") this.setState({homeBold:'bold'})
       else if (pathname === "/edit") this.setState({editBold:'bold'})
   }
   clear() {
       this.setState({homeBold:'',editBold:''})
   }
    componentDidMount() {
        this.clear()
        this.setCurrentTitle()
    }
	render() {
        const {homeBold,editBold} = this.state;
		return (
			<Navbar className="nav-color white">
				<Nav>
					<NavLink className={`pointer ${homeBold}`} onClick={() => this.handleHome()}>Home</NavLink>
					<NavLink className={`pointer ${editBold}`} onClick={() => this.handleEdit()}>Edit</NavLink>
				</Nav>
			</Navbar>
		);
	}
}
export default withRouter(Header)