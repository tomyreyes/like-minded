import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'
import MapContainer from './MapContainer'

class Search extends Component {
    render(){
        const styles = {
            inputMargin: {
                paddingBottom: '30px'
            }
        }
        return(
            <Input style={styles.inputMargin} placeholder="Enter Location"
                onChange={this.props.searchInput} onKeyDown={(e) => { if (e.keyCode === 13) this.props.handleSearch(this.props.search) }}></Input>
        )
    }
}

export default Search