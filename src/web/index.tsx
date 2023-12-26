import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataConnection } from "./state/data-connection";
import { RecoilRoot } from "recoil";

import { NoMatch } from "./pages/404";

import "./index.css";
import PageHeader from "./widgets/header";
import { TransactionsPage } from "./pages/transactions";
import { SettingsPage } from "./pages/settings";
import { TransactionByIdPage } from "./pages/transaction-[id]";
import { BucketsPage } from "./pages/buckets";
import { BucketByIdPage } from "./pages/bucket-[id]";
import { FiltersPage } from "./pages/filters";
import { FilterById } from "./pages/filter-[id]";
import { BalancesPage } from "./pages/balances";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RecoilRoot>
    <DataConnection>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageHeader />}>
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transaction/*" element={<TransactionByIdPage />} />
            <Route path="/buckets" element={<BucketsPage/>} />
            <Route path="/bucket/:id" element={<BucketByIdPage />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/filter/:id" element={<FilterById />} />
            <Route path="/balance" element={<BalancesPage />} />            
            <Route path="settings" element={<SettingsPage />} /> 
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataConnection>
  </RecoilRoot>,
);
