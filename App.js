import React, { Component } from 'react';
import Timeline from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';

class MyTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      groups: [
        { id: 1, title: '12V - 1 (PM)' },
        { id: 2, title: '12V - 2 (DS)' },
        { id: 3, title: 'Justin' },
        { id: 4, title: 'Kory' },
        { id: 5, title: 'DETAIL 1' },
        { id: 6, title: 'Perry' },
        { id: 7, title: 'TCS BODY' },
        { id: 8, title: 'Courtney' },
        { id: 9, title: 'Taylor' },
        { id: 10, title: 'Glen' },
        { id: 11, title: 'GRAPHICS (JM)' },
        { id: 12, title: 'Tony Scott' }
      ],
      items: [],
      isLoading: false,
      isError: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch(`https://www.zohoapis.com/crm/v2/deals`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Zoho-oauthtoken 9ac01d1ddf2732746282066d60f0dc31',
      }
    })
      .then(response => response.json())
      .then(data => {
        const items = data.data.map(deal => {
          return {
            id: deal.id,
            group: this.getGroupFromDeal(deal),
            title: deal.fields['Booking Number'],
            start_time: new Date(deal.fields['Start Time']),
            end_time: new Date(deal.fields['End Time'])
          }
        });
        this.setState({
          items,
          deals: data.data,
          isLoading: false
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
          isError: true
        });
      });
  }

  getGroupFromDeal(deal) {
    const serviceProvider = deal.fields['Service Provider'];
    const group = this.state.groups.find(group => group.title === serviceProvider);
    return group ? group.id : null;
  }

  handleItemClick(itemId, callback) {
    const deal = this.state.deals.find(deal => deal.id === itemId);
    if (deal) {
      callback({
        'Service Provider': deal.fields['Service Provider'],
        'Start Time': deal.fields['Start Time'],
        'End Time': deal.fields['End Time']
      });
    }
  }

  render() {
    const { isLoading, isError, groups, items } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error loading data</div>;
    }

    return (
     <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={new Date(2023, 2, 29, 9, 0, 0)}
        defaultTimeEnd={new Date(2023, 2, 29, 18, 0, 0)}
        onItemSelect={this.handleItemClick.bind(this)}
/>
);
}
}

export default MyTimeline;
