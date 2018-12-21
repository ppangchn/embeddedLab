import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { database } from '../../firebase';
import axios from 'axios';
import Select from 'react-select';
import '../../css/Home.css';
class Edit extends Component {
	constructor() {
		super();
		this.state = {
			amountPerMeal: 0,
			maxFeed: {},
			optionsFeeding: [
				{ value: 0, label: 0 },
				{ value: 1, label: 1 },
				{ value: 2, label: 2 },
				{ value: 3, label: 3 },
				{ value: 4, label: 4 },
				{ value: 5, label: 5 },
				{ value: 6, label: 6 },
				{ value: 7, label: 7 },
				{ value: 8, label: 8 },
				{ value: 9, label: 9 },
			],
			toggleModalSave: false,
		};
	}
	handleAmount(e) {
		this.setState({ amountPerMeal: e.target.value });
	}
	handleSelectFeed(e) {
		this.setState({ maxFeed: e });
	}
	async toggleModalSave() {
		const { amountPerMeal, maxFeed } = this.state;
		var data = {
			amountPerMeal: +amountPerMeal,
			maximumNumFeed: maxFeed.value,
		};
		console.log(data);
		await database.ref('/feeding').update(data);
		this.setState({ toggleModalSave: !this.state.toggleModalSave });
		try {
			await axios.post('http://localhost:5000/edit', data).then(res => {
				console.log(res.data);
			});
		} catch (error) {
			console.log(error);
		}
	}
	componentDidMount() {
		database.ref('/feeding').on('value', snapshot => {
			const data = snapshot.val();
			this.setState({
				amountPerMeal: data.amountPerMeal,
				maxFeed: { value: data.maximumNumFeed, label: data.maximumNumFeed },
			});
		});
	}
	render() {
		const { amountPerMeal, optionsFeeding, maxFeed, toggleModalSave } = this.state;
		return (
			<Container className="position-center pd-top-3 pd-bottom-3">
				<Row className="sub-title orange pd-bottom-2">
					<Col>Custom your feeding</Col>
				</Row>
				<Row className="pd-bottom-2">
					<Col>Amount per meal :</Col>
					<Col>
						<Input value={amountPerMeal} onChange={e => this.handleAmount(e)} />
					</Col>
				</Row>
				<Row className="pd-bottom-2">
					<Col>Maximum number of feeding : </Col>
					<Col>
						<Select options={optionsFeeding} value={maxFeed} onChange={e => this.handleSelectFeed(e)} />
					</Col>
				</Row>
				<Row className="pd-left-20 pd-right-20 pd-top-3">
					<Col>
						<Button block onClick={() => this.toggleModalSave()} color="orange">
							Save
						</Button>
					</Col>
				</Row>
				<Modal isOpen={toggleModalSave} toggle={toggleModalSave} centered>
					<ModalBody>Save!</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={() => this.toggleModalSave()}>
							OK
						</Button>
					</ModalFooter>
				</Modal>
			</Container>
		);
	}
}

export default Edit;
