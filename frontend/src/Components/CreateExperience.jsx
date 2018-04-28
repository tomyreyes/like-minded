import React, { Component } from 'react'
import { Button, Form, Input, Modal } from 'semantic-ui-react'
import TimePicker from 'react-time-picker'

class CreateExperience extends Component {
    
    render(){
        const styles = {
            modal: {
                marginTop: '100px',
                textAlign: 'center',
                marginLeft: '497px'
            }
        }
        return(
            <Modal style={styles.modal} trigger={<Button color="violet">Create</Button>}>
                <Modal.Header >Create an Experience</Modal.Header>
                <Modal.Content>
                    <div>
                        <Form>
                            <Form.Input label="Title:" value={this.props.title} onChange={this.props.titleInput} />
                            <Modal style={styles.modal} trigger={<Button>Set Time</Button>}>
                                <TimePicker
                                    onChange={this.props.onChange}
                                    value={this.props.time} />
                            </Modal>
                            <Form.Input label="Duration - in minutes" value={this.props.duration} type="number" onChange={this.props.durationInput} />
                            <Form.Input label="Location" value={this.props.location} onChange={this.props.locationInput} />
                            <Form.Input label="Max participants" value={this.props.max} type="number" onChange={this.props.maxInput} />
                            <Form.TextArea label="Description" value={this.props.description} onChange={this.props.detailsInput} />
                            <Button primary onClick={this.props.create} color="violet">Create</Button>
                        </Form>

                    </div>

                </Modal.Content>
            </Modal>  
        )
    }
}
export default CreateExperience