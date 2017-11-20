
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classname from 'classname';
import moment from 'moment';
import qs from 'querystring';
import { Link, browserHistory } from 'react-router';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';
import Sheet from '../../components/sheet';
import ServiceEventList from '../../components/service-event-list';
import ServiceStats from '../../components/service-stats';
import ServiceTasks from '../../components/service-tasks';
import ServiceTaskDef from '../../components/service-task-def';
import styles from './index.css';

const awsRegion = process.env.AWS_REGION

const activeLinkStyle = {
  borderBottomColor: '#fff',
  color: '#54585E',
};

export default class Service extends Component {
  constructor() {
    super()
    const hash = window.location.hash.slice(1)
    const map = qs.decode(hash)
    this.state = {
      tab: map.tab
    }
  }

  render() {
    const { service, clusterName, tasks } = this.props;

    return (
      <div className={styles.Service}>
        <Sheet onClose={::this.closeSheet}>
          <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/clusters/${clusterName}/services/${service.serviceName}/details`}>
            <h1 tabIndex="-1" ref="heading" className={styles.ServiceName}>{service.serviceName}</h1>
          </a>
          <ServiceStats service={service} left={true} />
          <Tabs handleSelect={::this.selectTab} selectedTab={this.state.tab} className={styles.ServiceTabs} activeLinkStyle={activeLinkStyle}>
            <nav className={styles['ServiceTabs-navigation']}>
              <ul>
                <li>
                  <a href="#tab=task_def">
                    <TabLink to="task_def">Task Def</TabLink>
                  </a>
                </li>
                <li>
                  <a href="#tab=events">
                    <TabLink to="events">Events</TabLink>
                  </a>
                </li>
                <li>
                  <a href="#tab=tasks">
                    <TabLink to="tasks">Tasks</TabLink>
                  </a>
                </li>
              </ul>
            </nav>

            <div className={styles['ServiceTabs-content']}>
              <TabContent for="events">
                <ServiceEventList events={service.events} />
              </TabContent>
              <TabContent for="task_def">
                <ServiceTaskDef
                  family={service.task.family}
                  revision={service.task.revision}
                  definitions={service.task.containerDefinitions} />
              </TabContent>
              <TabContent for="tasks">
                <ServiceTasks
                  clusterName={clusterName}
                  tasks={tasks}
                />
              </TabContent>
            </div>
          </Tabs>
        </Sheet>
      </div>
    );
  }

  /**
   * Select the given `tab`.
   */

  selectTab(tab) {
    this.setState({ tab: tab })
  }

  /**
   * Close the sheet.
   */

  closeSheet() {
    const { service } = this.props;
    const clusterName = service.clusterArn.split('cluster/')[1];
    browserHistory.push(`/${clusterName}`);
  }

  /**
   * Put focus in the sheet.
   */

  componentDidMount() {
    findDOMNode(this.refs.heading).focus();
  }
};
