import React,{Component} from 'react'
import {Switch,Route} from 'react-router-dom'
import Home from '../components/Home'
import Edit from '../components/Edit'
class MainRoute extends Component {
    render() {
        return(
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/edit" component={Edit}/>
            </Switch>
        );
    }
}

export default MainRoute