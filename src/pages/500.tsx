import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import styles from './500.module.css'

function Custom500() {
    return (
        <div className={styles.container}>
            <p>
                <span className={styles.statusCode}>500</span> Server-side error occurred.
            </p>
            <ColorSkycons className={styles.icon} type={ColorSkyconsType.THUNDER} animate={true} size={375} resizeClear={true} />
        </div>
    )
}

export default Custom500
