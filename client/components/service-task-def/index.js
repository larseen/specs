
import React, { Component } from 'react';
import classname from 'classname';
import styles from './index.css';

const awsRegion = process.env.AWS_REGION

export default class ServiceTaskDef extends Component {
  render() {
    const { family, revision, definitions } = this.props;

    return (
      <div className={styles.ServiceTaskDef}>
        <h3 className={styles.ServiceTaskDefName}>
          Task Definition:
          <a href={`https://${awsRegion}.console.aws.amazon.com/ecs/home?region=${awsRegion}#/taskDefinitions/${family}/${revision}`}>
            {family}:{revision}
          </a>
        </h3>
        {definitions.map(({ name, cpu, memory, environment, command }) => (
          <table key={name}>
            <tbody>
              <tr>
                <th>Container</th>
                <td>{name}</td>
              </tr>
              <tr>
                <th>CPU</th>
                <td>{cpu}</td>
              </tr>
              <tr>
                <th>memory</th>
                <td>{memory}</td>
              </tr>
              <tr>
                <th>command</th>
                <td>
                  <code>{command ? command.join(' ') : null}</code>
                </td>
              </tr>
              <tr>
                <th>environment</th>
                <td>
                  <ul className={styles.ServiceTaskDefEnvVars}>
                    {environment.map(({ name, value }) =>
                      <li key={`__${family}_${revision}_env_${name}`}><code>{name}={value}</code></li>
                    )}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    );
  }
};
