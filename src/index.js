var React = require('react');
var ReactDOM = require('react-dom');

const DOTASTATS_API = `http://dotabetstats.herokuapp.com`

class IssuesApp extends React.Component {
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

var ListMatch = React.createClass({
	renderTableRows: function() {
		const { listmatch } = this.props;
		return listmatch.map((i) => <TableRow match={i} key={i.id.toString()}/>);
	},
	render: function() {
		const tableRows = this.renderTableRows();
		return (
			<div className="container-fluid">
				{tableRows}
			</div>
		)
	}
})

var TableRow = React.createClass({
	render: function (){
		const { match } = this.props;
		return (
			<div>
				<div className="row">
					<div className="col-md-4 text-center">
						<a href={"/match?id=" + match.id}>
							{match.tournament} - {match.mode_name}
						</a>
					</div>
				</div>
				<div className="row">
					<div className="col-md-2">{match.teama}</div>
					<div className="col-md-2">{match.bestof}</div>
					<div className="col-md-2">{match.teamb}</div>
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
})

ReactDOM.render(<IssuesApp />, document.getElementById('react-app'))

