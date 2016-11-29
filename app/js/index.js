import React from 'react';
import { render } from 'react-dom';

class A extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>abc</div>
		);
	}
};

export default A;

render(
	<A></A>,
	document.getElementById("reactapp")
);