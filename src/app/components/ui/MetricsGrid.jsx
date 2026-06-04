"use client";

import styles from "@/assets/css/ui/MetricsGrid.module.css";

export default function MetricsGrid({ metrics = [] }) {
  return (
    <div className={styles.metricsGrid}>
      {metrics.map((metric) => (
        <div key={metric.title} className={styles.metricsCard}>
          <div className={styles.metricsCardContent}>
            <div 
              className={styles.metricsIconWrapper} 
              style={{ backgroundColor: metric.bgColor || `${metric.color}15` }}
            >
              {metric.icon}
            </div>
            <div className={styles.metricsTextWrapper}>
              <p className={styles.metricsTitle}>{metric.title}</p>
              <h2 className={styles.metricsValue}>{metric.value}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}