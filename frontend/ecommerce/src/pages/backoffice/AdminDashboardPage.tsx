// AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import "../styles/admin-dashboard.css";

const AdminDashboardPage = () => {
  // Données pour le graphique des produits les plus vendus
  const [topProductsData, setTopProductsData] = useState({
    products: [
      "iPhone 15 Pro Max",
      "Samsung Galaxy S24",
      "iPhone 14 Pro",
      "Xiaomi 13T Pro",
      "iPhone 13",
    ],
    sales: [142, 98, 87, 64, 52],
    revenue: [184258, 117620, 78213, 38336, 31148],
  });

  // Données pour la répartition par catégorie
  const [categoryData, setCategoryData] = useState([
    { id: 0, value: 78500, label: "Téléphones" },
    { id: 1, value: 32100, label: "Outillage" },
    { id: 2, value: 16850, label: "Maintenance" },
  ]);

  // Données pour l'évolution mensuelle
  const [monthlyData, setMonthlyData] = useState({
    months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    phones: [45000, 52000, 48000, 61000, 70000, 78500],
    tools: [18000, 22000, 25000, 28000, 30000, 32100],
    maintenance: [8000, 10000, 12000, 14000, 15000, 16850],
  });

  // Données par marque de téléphones
  const [phoneBrandsData, setPhoneBrandsData] = useState([
    { id: 0, value: 42, label: "Apple" },
    { id: 1, value: 28, label: "Samsung" },
    { id: 2, value: 10, label: "Xiaomi" },
    { id: 3, value: 5, label: "Autres" },
  ]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>📊 Dashboard Admin</h1>
          <p>Analytics et statistiques de vente</p>
        </div>
      </div>

      {/* Section graphiques principaux */}
      <div className="charts-grid">
        {/* Graphique en barres - Top produits par ventes */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>🏆 Top 5 Produits - Nombre de ventes</h2>
            <select className="chart-filter">
              <option>Cette semaine</option>
              <option>Ce mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="chart-container">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: topProductsData.products,
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: "end",
                    fontSize: 12,
                  },
                },
              ]}
              series={[
                {
                  data: topProductsData.sales,
                  label: "Nombre de ventes",
                  color: "#3b82f6",
                },
              ]}
              height={350}
              margin={{ bottom: 100, left: 60, right: 20, top: 20 }}
            />
          </div>
        </div>

        {/* Graphique en barres - Top produits par revenus */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>💰 Top 5 Produits - Revenus générés</h2>
            <span className="chart-subtitle">En euros (€)</span>
          </div>
          <div className="chart-container">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: topProductsData.products,
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: "end",
                    fontSize: 12,
                  },
                },
              ]}
              series={[
                {
                  data: topProductsData.revenue,
                  label: "Revenus (€)",
                  color: "#10b981",
                  valueFormatter: (value) => `${value.toLocaleString()}€`,
                },
              ]}
              height={350}
              margin={{ bottom: 100, left: 80, right: 20, top: 20 }}
            />
          </div>
        </div>

        {/* Graphique circulaire - Répartition CA par catégorie */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>📊 Répartition du CA par catégorie</h2>
            <span className="chart-total">
              Total:{" "}
              {categoryData.reduce((a, b) => a + b.value, 0).toLocaleString()}€
            </span>
          </div>
          <div className="chart-container">
            <PieChart
              series={[
                {
                  data: categoryData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  valueFormatter: (item) => `${item.value.toLocaleString()}€`,
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: 0,
                },
              }}
            />
          </div>
        </div>

        {/* Graphique circulaire - Répartition par marque */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>📱 Répartition par marque de téléphones</h2>
            <span className="chart-subtitle">Nombre de produits en stock</span>
          </div>
          <div className="chart-container">
            <PieChart
              series={[
                {
                  data: phoneBrandsData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  valueFormatter: (item) => `${item.value} produits`,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "bottom", horizontal: "middle" },
                  padding: 0,
                },
              }}
            />
          </div>
        </div>

        {/* Graphique en lignes - Évolution mensuelle du CA par catégorie */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h2>📈 Évolution mensuelle du CA par catégorie</h2>
            <div className="chart-legend-custom">
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: "#3b82f6" }}
                ></span>
                Téléphones
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: "#10b981" }}
                ></span>
                Outillage
              </span>
              <span className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: "#f59e0b" }}
                ></span>
                Maintenance
              </span>
            </div>
          </div>
          <div className="chart-container">
            <LineChart
              xAxis={[{ scaleType: "point", data: monthlyData.months }]}
              series={[
                {
                  data: monthlyData.phones,
                  label: "Téléphones",
                  color: "#3b82f6",
                  curve: "natural",
                  showMark: true,
                  valueFormatter: (value) => `${value.toLocaleString()}€`,
                },
                {
                  data: monthlyData.tools,
                  label: "Outillage",
                  color: "#10b981",
                  curve: "natural",
                  showMark: true,
                  valueFormatter: (value) => `${value.toLocaleString()}€`,
                },
                {
                  data: monthlyData.maintenance,
                  label: "Maintenance",
                  color: "#f59e0b",
                  curve: "natural",
                  showMark: true,
                  valueFormatter: (value) => `${value.toLocaleString()}€`,
                },
              ]}
              height={400}
              margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
        </div>

        {/* Comparaison Ventes vs Revenus */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h2>📊 Comparaison: Ventes vs Revenus (Top 5)</h2>
          </div>
          <div className="chart-container">
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: topProductsData.products,
                },
              ]}
              series={[
                {
                  data: topProductsData.sales,
                  label: "Nombre de ventes",
                  color: "#3b82f6",
                  yAxisKey: "leftAxis",
                },
                {
                  data: topProductsData.revenue.map((r) => r / 1000),
                  label: "Revenus (milliers €)",
                  color: "#10b981",
                  yAxisKey: "rightAxis",
                },
              ]}
              yAxis={[
                { id: "leftAxis", scaleType: "linear" },
                { id: "rightAxis", scaleType: "linear" },
              ]}
              height={350}
              margin={{ bottom: 80, left: 60, right: 60, top: 20 }}
            />
          </div>
        </div>
      </div>

      {/* Stats complémentaires */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <strong>Taux de conversion</strong>
            <p className="stat-value">3.2%</p>
            <span className="stat-change positive">+0.5% vs mois dernier</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">🛒</span>
          <div className="stat-content">
            <strong>Panier moyen</strong>
            <p className="stat-value">372€</p>
            <span className="stat-change positive">+12% vs mois dernier</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <div className="stat-content">
            <strong>Satisfaction client</strong>
            <p className="stat-value">4.7/5</p>
            <span className="stat-change">245 avis ce mois</span>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icon">📦</span>
          <div className="stat-content">
            <strong>Taux de livraison</strong>
            <p className="stat-value">98.5%</p>
            <span className="stat-change positive">+1.2% vs mois dernier</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
