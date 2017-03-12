import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, Link} from 'react-router';

const DOTASTATS_API = `http://dotabetstats.herokuapp.com`

class Home extends Component {
	constructor(config) {
		super(config)
		this.state = {
			listmatch: [
			]
		}
	}

	componentDidMount () {
		this.fetchListMatch()
	}

	fetchListMatch = () => {
		fetch(DOTASTATS_API + "/match?limit=100&status=open")
			.then( res => {
				if (res.ok) {
					res.json().then((data) => {
						this.setState({
							listmatch: data
						})
					})
				}
			})
	}

	render() {
		const {listmatch} = this.state;
		return (
			<div>
				hello world
				<ListMatch listmatch={listmatch} />
			</div>
		);
	}
}

class ListMatch extends Component {
	renderTableRows() {
		const { listmatch } = this.props;
		return listmatch.map((i) => <TableRow match={i} key={i.id.toString()}/>);
	}
	render (){
		const tableRows = this.renderTableRows();
		return (
			<div className="container-fluid">
				{tableRows}
			</div>
		)
	}
}

class TableRow extends Component {
	render  (){
		const { match } = this.props;
		return (
			<div>
				<div className="row">
					<div className="col-md-4 text-center">
						{match.tournament} - {match.mode_name}
					</div>
				</div>
				<div className="row">
					<div className="col-md-2">
						<Link to={"/team/"+match.teama}>
							{match.teama}
						</Link>
					</div>
					<div className="col-md-2">{match.bestof}</div>
					<div className="col-md-2">
						<Link to={"/team/"+match.teamb}>
							{match.teamb}
						</Link>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3">{match.ratioa}</div>
					<div className="col-md-3">{match.ratiob}</div>
				</div>
				<div className="row">
					<div className="col-md-3 text-center">{match.status}</div>
				</div>
				{
					match.status === "Settled"
			   	? 	<div>
						<div className="row">
							<div className="col-md-3">{match.scorea}</div>
							<div className="col-md-3">{match.scoreb}</div>
						</div>
						<div className="row">
							<div className="col-md-3 text-center">{match.winner} won</div>
						</div>
					</div>
				:	''
				}
				<hr/>
			</div>
		)
	}
}

class TeamDetail extends Component {
	constructor(config) {
		super(config)
		this.state = {
			teamDetail:{}
		}
	}

	componentDidMount(){
		this.fetchTeamDetail()
	}

	fetchTeamDetail = () => {
		fetch(DOTASTATS_API + "/f10k/" + this.props.params.name)
			.then( res => {
				if (res.ok) {
					res.json().then((data) => {
						this.setState({
							listmatch: data
						})
						console.log(data)
					})
				}
			})
	}

	render() {
		return (
			<div>
				{this.props.params.name}
			</div>
		)
	}
}

class Dotastats extends Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path='/' component={Home} />
				<Route path='/team/:name' component={TeamDetail}/>
			</Router>
		)
	}
}

render(<Dotastats/>,document.getElementById('react-app'));

export default Dotastats

