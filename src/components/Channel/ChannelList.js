import React from 'react';
import Channel from './Channel';

class ChannelList extends React.Component {
    state = { name: '', toggle: true };
   
    handleChange = (event) => {
      this.setState({name: event.target.value});
    }
   
    handleSubmit = (event) => {
   
      fetch('http://localhost:3000/new-room', {
          method: 'POST',
          body: JSON.stringify(this.state.name)
        })
        .then(function(response) {
          console.log(response)
          return response.json();
        });
   
      event.preventDefault();
  }
  
    handleClick = id => {
        this.props.onSelectChannel(id);
    }

    toggle = () => {
        if (this.state.toggle) {
            this.setState({ toggle: false})
        } else if (this.state.toggle === false) {
            this.setState({ toggle: true})
        }
    }

    render() {

        let list = <div className="no-content-message">No rooms yet :(</div>;
        if (this.props.channels && this.props.channels.map) {
            list = this.props.channels.map(c => <Channel key={c.id} id={c.id} name={c.name} participants={c.participants} onClick={this.handleClick} />);
        }

        let addRoomBtn = 
        <button className="addRoomBtn" onClick={this.toggle}>
            Add Room
        </button>

        let newRoomForm = 
        <form onSubmit={this.handleSubmit}>
            <label>
                Name:
                <input type="text" value={this.state.value} name="name" onChange={this.handleChange} />
            </label>
            <input type="submit" value="Create" onClick={() => {
              this.toggle();
              this.handleSubmit();
            }}></input>
        </form>

        return (
            <div className='channel-list'>
                {list}
                { this.state.toggle ? addRoomBtn : newRoomForm }
            </div>);
    }

}

export default ChannelList;