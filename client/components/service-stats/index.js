
import React, { Component } from 'react';
import moment from 'moment';
import classname from 'classname';
import styles from './index.css';

const ContainerLogs = ({ logConfiguration }) => {
  if (logConfiguration.logDriver !== 'awslogs') {
    return null;
  }

  return (
    <tr>
      <th>Logs</th>
      <td title='Cloudwatch Logs'>
        <a href={`https://${logConfiguration.options['awslogs-region']}.console.aws.amazon.com/cloudwatch/home?region=${logConfiguration.options['awslogs-region']}#logStream:group=${logConfiguration.options['awslogs-group']}`}>
          Cloudwatch Logs
        </a>
      </td>
    </tr>
  )
}

const ContainerImage = ({ image }) => (
  <tr>
    <th>Image</th>
    <td title={image}>
      {image.split('/')[1] || image}
    </td>
  </tr>
);

const ContainerInformation = ({ left, service, containers, multiple }) => {
  if (!multiple) {
    const { image, logConfiguration } = containers[0];
    return (
      <tbody>
        <ContainerImage image={image} />
        {left && <ContainerLogs logConfiguration={logConfiguration} />}
      </tbody>
    )
  } else {
    return (
      <tbody>
        {left && <tr><th>Containers</th></tr>}
        {containers.map(({ name, image }) => <ContainerImage name={name} key={name} image={image} />)}
        {left && containers.map(({ name, logConfiguration }) => <ContainerLogs key={name} logConfiguration={logConfiguration} />)}
      </tbody>
    )
  }
}

export default class ServiceStats extends Component {
  render() {
    const { service, left } = this.props;
    const { runningCount, desiredCount } = service;
    const containers = service.task.containerDefinitions;
    const date = moment(service.deployments[0].updatedAt)
    const updatedAgo = date.fromNow();
    const updatedIso = date.toISOString();
    const classes = classname({
      [styles.ServiceStats]: true,
      [styles['ServiceStats--left-aligned']]: left
    });
    return (
      <div className={classes}>
        <table>
          <tbody>
            <tr>
              <th>Updated</th>
              <td title={updatedIso}>
                <time dateTime={updatedIso}>{updatedAgo}</time>
              </td>
            </tr>
            <tr>
              <th>Running</th>
              <td title={`${runningCount} out of ${desiredCount}`}>
                {runningCount} out of {desiredCount}
              </td>
            </tr>
          </tbody>
          <ContainerInformation
            left={left}
            service={service}
            containers={containers}
            multiple={containers.length > 1}
          />
        </table>
      </div>
    );
  }
};
