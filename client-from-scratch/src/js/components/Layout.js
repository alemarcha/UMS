import React, { Component } from 'react';
class Layout extends Component {
    render() {
        return (
        <div>
            <p>Header here</p>
    
            <div>{this.props.children}</div>
    
            <p>Footer here</p>
        </div>
        );
      }
}

export default Layout;