import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { database } from '../../firebase';
import { AreaChart, Area, XAxis, YAxis, Legend ,CartesianGrid} from 'recharts';
import moment from 'moment';
import axios from 'axios';
import '../../css/Home.css';
const toArray = str => {
	const arr = [];
	for (const key in str) {
		if (str.hasOwnProperty(key)) {
			const element = str[key];
			arr.push({ ...element, id: key });
		}
	}
	return arr;
};
class Home extends Component {
	constructor() {
		super();
		this.state = {
			feedButton: 'FEED',
			catStatusImg: '',
			catHungry: 'https://cdn3.iconfinder.com/data/icons/cat-power-premium/120/cat_hungry-512.png',
			catFull: 'https://cdn3.iconfinder.com/data/icons/cat-power-premium/120/cat_foodlove-512.png',
			catTooFull: 'https://cdn3.iconfinder.com/data/icons/cat-power-premium/120/cat_fat-512.png',
			maxFeed: 0,
			disabled: false,
			currentFeed: 0,
			lineChartData: [
				{ day: '0', feeding: 100, eating: 123 },
				{ day: '1', feeding: 250, eating: 251 },
				{ day: '2', feeding: 500, eating: 122 },
				{ day: '3', feeding: 215, eating: 754 },
				{ day: '4', feeding: 413, eating: 345 },
				{ day: '5', feeding: 800, eating: 214 },
				{ day: '6', feeding: 194, eating: 109 },
			],
			amountPerMeal: 0,
			totalAmount: 0,
		};
	}
	async handleFeed() {
		const { currentFeed, totalAmount, amountPerMeal } = this.state;
		const newCurrentFeed = currentFeed + 1;
		database.ref('/feeding/summaryFeed').once('value', snapshot => {
			let summaryFeedData = toArray(snapshot.val());
			let currentSummary = summaryFeedData[summaryFeedData.length - 1];
			console.log(currentSummary);
			if (currentSummary) {
				let feed = {
					isFeed: true,
					currentFeed: newCurrentFeed,
					lastFeed: Date.now(),
					totalAmount: totalAmount + amountPerMeal,
				};
				database.ref('/feeding').update(feed);
			}
		});
		await axios.get('http://localhost:5000/feeding').then(res => {
			console.log(res.data);
		});
	}
	componentDidMount() {
		const { catHungry, catFull, catTooFull, maxFeed } = this.state;
		database.ref('/feeding').on('value', snapshot => {
			// console.log(moment().format('dddd'))
			// console.log('data -> ', snapshot.val());
			const data = snapshot.val();
			if (data.currentFeed < data.maximumNumFeed) {
				if (data.isFeed) {
					this.setState({
						feedButton: "You've already fed your pet.",
						disabled: true,
						catStatusImg: catFull,
					});
				} else {
					this.setState({ catStatusImg: catHungry });
				}
				if (Date.now() - data.lastFeed > 5000) {
					this.setState({ disabled: false, feedButton: 'FEED', catStatusImg: catHungry });
					database.ref('/feeding').update({ isFeed: false });
				}
			} else if (data.currentFeed === data.maximumNumFeed)
				//equal to max feed limit?? //
				this.setState({
					catStatusImg: catTooFull,
					feedButton: 'Maximum feeding for today!',
					disabled: true,
				});
			this.setState({
				currentFeed: data.currentFeed,
				maxFeed: data.maximumNumFeed,
				amountPerMeal: data.amountPerMeal,
				totalAmount: data.totalAmount
			});
		});
		database.ref('feeding/summaryFeed').on('value', snapshot => {
			let summaryFeedData = toArray(snapshot.val());
			summaryFeedData = summaryFeedData.slice(summaryFeedData.length - 7, summaryFeedData.length);
			if (summaryFeedData) {
				this.setState({ lineChartData: summaryFeedData });
			}
		});
		setInterval(() => {
			const update = {
				lastUpdate: Date.now(),
			};
			database.ref('/feeding').update(update);
		}, 100);
	}
	render() {
		const { feedButton, catStatusImg, disabled, lineChartData, currentFeed, totalAmount } = this.state;
		return (
			<Container className="position-center pd-top-3 pd-bottom-3">
				<img
					src="https://www.hillspet.com/content/dam/cp-sites/hills/hills-pet/en_us/img/care/HP_PCC_lg_cat_nutrition_hero.jpg"
					className="bg"
					alt=""
				/>
				<Row>
					<Col className="title pd-bottom-3 orange">Happy Pet Guardian</Col>
				</Row>
				<Row>
					<Col>
						<img src={catStatusImg} className="size-img" />
					</Col>
				</Row>
				<Row className="mg-bottom-20 pd-left-20 pd-right-20">
					<Col>
						<Button size="lg" color="danger" block onClick={() => this.handleFeed()} disabled={disabled}>
							{feedButton}
						</Button>
					</Col>
				</Row>
				<Row className="sub-title orange pd-bottom-2">
					<Col>Today</Col>
					<Col>Number of feeding</Col>
				</Row>
				<Row className="sub-title orange pd-bottom-5">
					<Col>{totalAmount}</Col>
					<Col>{currentFeed}</Col>
				</Row>
				<Row>
					<Col className="sub-title orange">Stats in Week</Col>
				</Row>
				<Row>
					<Col className="pd-top-3 pd-bottom-3">
						<AreaChart width={1100} height={400} data={lineChartData}>
							<XAxis dataKey="day" />
							<YAxis dataKey="feeding" />
							<Legend verticalAlign="top" height={36}/>
							<CartesianGrid strokeDasharray="3 3" />
							<Area type="monotone" dataKey="feeding" stroke="#FF7700" fill="#FF7700" fillOpacity={0.5} />
							<Area type="monotone" dataKey="eating" stroke="#0066CC" fill="#0066CC" fillOpacity={0.5} />
						</AreaChart>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Home;
