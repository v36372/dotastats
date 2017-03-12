import React, {Component} from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, Link} from 'react-router';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {lightGreenA700, red700, transparent} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Moment from 'react-moment';
injectTapEventPlugin();

const DOTASTATS_API = `https://dotabetstats.herokuapp.com`

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
			<Card>
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
			</Card>
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
						data.f10kHistory.forEach(function(match){
							if (match.kill === 10) {
								match.style = {
									backgroundColor: 'cornflowerblue'
								}
							} else {
								match.style = {
									backgroundColor: 'orangered'
								}
							}
						})
						this.setState({
							teamDetail: data
						})
					})
				}
			})
	}

	render() {
		const { teamDetail } = this.state

		return (
			<Card>
			<CardTitle title={this.props.params.name} subtitle="Data from: " />
			<div>
			<CardText>
			<DatePicker hintText="From" autoOk defaultDate={new Date(Date.now() - 30 * 24 * 3600 * 1000)} container="inline" />
			<DatePicker hintText="To" autoOk defaultDate={new Date()} container="inline" />
			<Card>
				<CardTitle title="Statistics"/>
				<ul>
					<li>Average kill: {teamDetail.avgkill}</li>
					<li>Average death: {teamDetail.avgdeath}</li>
					<li>Total kill: {teamDetail.totalkill}</li>
					<li>Total death: {teamDetail.totaldeath}</li>
					<li>Winrate: {teamDetail.winrate}</li>
					<li>Average odds: {teamDetail.avgodds}</li>
				</ul>
			</Card>
				<Card>
				<CardTitle title="F10K history" />
				<List>
				{
					teamDetail.f10kHistory
						? teamDetail.f10kHistory.map(match =>
						<div key={teamDetail.f10kHistory.indexOf(match)} >
							<ListItem 
								primaryText={match.name} 
								leftAvatar={
									<Avatar
										color={ match.winner.toLowerCase() !== match.name.toLowerCase()? lightGreenA700:red700} backgroundColor={transparent}
										style={{left: 8}}
									>
									{match.winner.toLowerCase() !== match.name.toLowerCase()? "W":"L"}
									</Avatar>
								}
								rightAvatar={
								<p>
								{
									match.kill + " - " + match.death}
								</p>
								}
								secondaryText={<p>
									<Moment fromNow ago>{match.time}</Moment> ago</p>} 
								/>
								
								<Divider inset={true} />
								</div>
						)
						: ''
				}
				</List>
				</Card>
			</CardText>
			</div>
			</Card>
		)
	}
}

class Dotastats extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={getMuiTheme()}>
			<Router history={browserHistory}>
				<Route path='/' component={Home} />
				<Route path='/team/:name' component={TeamDetail}/>
			</Router>
  </MuiThemeProvider>
		)
	}
}

render(<Dotastats/>,document.getElementById('react-app'));

export default Dotastats

