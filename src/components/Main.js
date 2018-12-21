import React,{Component} from 'react'
import MainRoute from '../routes/MainRoute';
import Header from './Header'
class Main extends Component {
    render() {
        return(
            <div>
                <Header />
                <MainRoute />
            </div>
        );
    }
}

export default Main