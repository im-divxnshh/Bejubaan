'use client'

import { useState } from "react";


import { Modal, FloatButton, Input, Card, List } from "antd";
import { PhoneOutlined, PhoneFilled, MedicineBoxOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
const FloatButtons: React.FC = () => {

const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
const [isPoliceModalOpen, setIsPoliceModalOpen] = useState(false);
const [search, setSearch] = useState("");
const { Search } = Input;

const policeStations = [
        { name: "Aliganj Police Station", phone: "9454403078", address: "Aliganj, Bareilly" },
        { name: "Aonla Police Station", phone: "9454403079", address: "Aonla, Bareilly" },
        { name: "Baherhi Police Station", phone: "9454403080", address: "Baherhi, Bareilly" },
        { name: "Baradari Police Station", phone: "9454403081", address: "Baradari, Bareilly" },
        { name: "Bhamora Police Station", phone: "9454403082", address: "Bhamora, Bareilly" },
        { name: "Bhojipura Police Station", phone: "9454403083", address: "Bhojipura, Bareilly" },
        { name: "Bhutta Police Station", phone: "9454403084", address: "Bhutta, Bareilly" },
        { name: "Cantt. (Cantonment) Police Station", phone: "9454403085", address: "Cantonment, Bareilly" },
        { name: "Collector Buck Ganj Police Station", phone: "9454403086", address: "Buck Ganj, Bareilly" },
        { name: "Deorania Police Station", phone: "9454403087", address: "Deorania, Bareilly" },
        { name: "Faridpur Police Station", phone: "9454403088", address: "Faridpur, Bareilly" },
        { name: "Fatehganj East Police Station", phone: "9454403089", address: "Fatehganj East, Bareilly" },
        { name: "Fatehganj West Police Station", phone: "9454403090", address: "Fatehganj West, Bareilly" },
        { name: "Hafizganj Police Station", phone: "9454403091", address: "Hafizganj, Bareilly" },
        { name: "Izzatnagar Police Station", phone: "9454403092", address: "Izzatnagar, Bareilly" },
        { name: "Kotwali Police Station", phone: "9454403093", address: "Kotwali, Bareilly" },
        { name: "Kularia Police Station", phone: "9454403094", address: "Kularia, Bareilly" },
        { name: "Mahila Thana (Women’s Police Station)", phone: "9454403095", address: "Mahila Thana, Bareilly" },
        { name: "Meerganj Police Station", phone: "9454403096", address: "Meerganj, Bareilly" },
        { name: "Nariawal Police Station", phone: "9454403097", address: "Nariawal, Bareilly" },
        { name: "Nawabganj Police Station", phone: "9454403098", address: "Nawabganj, Bareilly" },
        { name: "Premnagar Police Station", phone: "9454403099", address: "Premnagar, Bareilly" },
        { name: "Quila Police Station", phone: "9454403100", address: "Quila, Bareilly" },
        { name: "Shahi Police Station", phone: "9454403101", address: "Shahi, Bareilly" },
        { name: "Sheeshgarh Police Station", phone: "9454403102", address: "Sheeshgarh, Bareilly" },
        { name: "Shergarh Police Station", phone: "9454403103", address: "Shergarh, Bareilly" },
        { name: "Sirauli Police Station", phone: "9454403104", address: "Sirauli, Bareilly" },
        { name: "Shubhash Nagar Police Station", phone: "9454403105", address: "Shubhash Nagar, Bareilly" },
        { name: "Visharat Ganj Police Station", phone: "9454403106", address: "Visharat Ganj, Bareilly" },
        // you can add more if you get more stations
    ];


const ambulances = [
    { name: "Animal Rescue Ambulance 1", phone: "1800123001", address: "Bareilly City" },
    { name: "Animal Rescue Ambulance 2", phone: "1800123002", address: "Civil Lines, Bareilly" },
    { name: "IVRI Animal Ambulance", phone: "1800123003", address: "Izatnagar, Bareilly" },
];

const filteredPolice = policeStations.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
    );

const filteredAmbulances = ambulances.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.toLowerCase().includes(search.toLowerCase())
    );



return (

    <>
     
     {/* ✅ Floating Buttons (Police + Ambulance) */}
      <FloatButton.Group
        shape="circle"
        style={{ right: 24, bottom: 24 }}
      >
        <FloatButton
          icon={<PhoneFilled />}
          tooltip="Contact Police"
          type="primary"
          onClick={() => { setIsPoliceModalOpen(true); setSearch(""); }}
        />
        <FloatButton
          icon={<MedicineBoxOutlined />}
          tooltip="Animal Ambulance"
          type="primary"
          onClick={() => { setIsAmbulanceModalOpen(true); setSearch(""); }}
        />
      </FloatButton.Group>

      {/* ✅ Police Modal with Search & Scroll */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-blue-600 flex items-center">
              🚔 Police Stations
            </span>
          </div>
        }
        open={isPoliceModalOpen}
        onCancel={() => setIsPoliceModalOpen(false)}
        footer={null}
        centered
        className="rounded-lg"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <Search
          placeholder="Search Police Station"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <List
          dataSource={filteredPolice}
          renderItem={(station) => (
            <Card
              hoverable
              className="mb-4 rounded-xl border border-blue-200 shadow bg-gradient-to-r from-blue-50 to-red-50"
              bodyStyle={{ padding: "16px" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-blue-800 flex items-center">
                    <SafetyCertificateOutlined className="text-red-500 mr-2 text-xl" />
                    {station.name}
                  </h3>
                  <p className="text-sm text-gray-600">📍 {station.address}</p>
                </div>
                <a href={`tel:${station.phone}`} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                  <PhoneOutlined /> {station.phone}
                </a>
              </div>
            </Card>
          )}
        />
      </Modal>

      {/* ✅ Ambulance Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-green-600 flex items-center">
              🚑 Animal Rescue Ambulance
            </span>
          </div>
        }
        open={isAmbulanceModalOpen}
        onCancel={() => setIsAmbulanceModalOpen(false)}
        footer={null}
        centered
        className="rounded-lg"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <Search
          placeholder="Search Ambulance Service"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <List
          dataSource={filteredAmbulances}
          renderItem={(service) => (
            <Card
              hoverable
              className="mb-4 rounded-xl border border-green-200 shadow bg-gradient-to-r from-green-50 to-blue-50"
              bodyStyle={{ padding: "16px" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-green-800 flex items-center">
                    <MedicineBoxOutlined className="text-green-500 mr-2 text-xl" />
                    {service.name}
                  </h3>
                  <p className="text-sm text-green-600">📍 {service.address}</p>
                </div>
                <a href={`tel:${service.phone}`} className="bg-gradient-to-r from-green-500 to-green-600 text-black px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                  <PhoneOutlined /> {service.phone}
                </a>
              </div>
            </Card>
          )}
        />
      </Modal>

     
</>



 );
};

export default FloatButtons;