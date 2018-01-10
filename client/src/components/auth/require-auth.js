import React, { Component } from 'react';  
import { connect } from 'react-redux';

export default function(ComposedComponent) {  
  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    }

    componentWillMount() {
      console.log(this.props.authenticated);
      if(!this.props.authenticated) {
        this.context.router.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      console.log(this.props.authenticated);
      if(!nextProps.authenticated) {
        this.context.router.push('/login');
      }
    }

    render() {
      console.log(this.props.authenticated);

      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    console.log("require-auth");
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}