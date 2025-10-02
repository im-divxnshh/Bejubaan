"use client";

import { useState } from "react";
import {
  Carousel,
  Card,
  Row,
  Col,
  Layout,
  Menu,
  Button,
  Typography,
  Steps,
  Statistic,
  Collapse,
  List,
  Modal,
  FloatButton,
  Input,
  message,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  HeartOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  VideoCameraOutlined,
  PictureOutlined,
  PhoneFilled,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const { Footer, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { Search } = Input;

export default function Home() {
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isPoliceModalOpen, setIsPoliceModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [msgApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const banners = [
    "/images/banners/banner1.jpeg",
    "/images/banners/banner2.jpeg",
    "/images/banners/banner3.jpg",
    "/images/banners/banner4.png",
    "/images/banners/banner5.jpeg",
  ];

  const videos = [
    { id: 1, title: "Rescue Mission: Mumbai", thumb: "/images/video1.jpg" },
    { id: 2, title: "Street Animal Care Drive", thumb: "/images/video2.jpg" },
    { id: 3, title: "Successful Adoption Story", thumb: "/images/video3.jpg" },
    { id: 4, title: "IVRI Training Session", thumb: "/images/video4.jpg" },
  ];

  const gallery = [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
    "/images/gallery5.jpg",
    "/images/gallery6.jpg",
    "/images/gallery7.jpg",
    "/images/gallery8.jpg",
  ];

  const faqs = [
    {
      q: "How do I report an injured animal?",
      a: "Use the 'Report a Rescue' button at the top. Upload a photo, location, and brief note. The app will notify nearby vets and rescue teams.",
    },
    {
      q: "Can I volunteer?",
      a: "Yes — register as a volunteer in the app. We coordinate training with local vets and IVRI where available.",
    },
    {
      q: "How is the project funded?",
      a: "We use donations, grants, sponsorship and merchandise sales to fund rescue operations — details are in the Business Model section.",
    },
  ];

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

  const handleRescue =  () =>{
   router.push(`/bejuwaan-user-login`);
  }


  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between flex-wrap">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.jpg"
              alt="Bejuwaan Logo"
              width={52}
              height={52}
              className="rounded-full"
            />
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-wide text-gray-800">
                बेजुबान — Bejuwaan
              </div>
              <div className="text-xs text-gray-500">Voice for the Voiceless</div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 mt-3 sm:mt-0 flex-wrap">
            <Button type="text" size="small">Programs</Button>
            <Button type="text" size="small">Resources</Button>
            <Button type="primary" onClick={handleRescue} className="px-3 sm:px-5">Report a Rescue</Button>
          </div>
        </div>
      </div>


      {/* Hero Carousel */}
      <Carousel autoplay effect="fade" className="h-[90vh]">
        {banners.map((src, i) => (
          <div key={i} className="relative w-full h-[90vh]">
            <Image src={src} alt={`Banner ${i + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-start px-10">
              <Title level={1} className="!text-white text-5xl font-extrabold drop-shadow-md max-w-3xl">
                Bejuwaan — Digital Emergency Response for Stray Animals
              </Title>
              <Paragraph className="text-lg text-gray-200 mt-4 max-w-2xl">
                One app to alert veterinarians, IVRI, police, NGOs and volunteers — ensuring fast, coordinated rescue and care for animals in distress.
              </Paragraph>
              <div className="mt-6 flex space-x-4">
                <Button type="primary" onClick={handleRescue} size="large" className="px-6 py-2">
                  Report a Rescue
                </Button>
                <Button size="large" className="px-6 py-2">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Why Bejuwaan + Videos */}
      <Content className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Title level={2} className="font-bold">
              Why Bejuwaan?
            </Title>
            <Paragraph className="text-gray-700 leading-relaxed">
              Stray animals face emergencies and injuries but there is no efficient way to notify nearby help. Bejuwaan bridges this gap with real-time alerts to vets, NGOs, police and volunteers.
            </Paragraph>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <Title level={4}>Problem</Title>
                <Paragraph className="text-sm">
                  Delayed coordination increases animal suffering and preventable deaths. Bejuwaan solves this with instant alerts.
                </Paragraph>
              </Card>
              <Card>
                <Title level={4}>Solution</Title>
                <Paragraph className="text-sm">
                  A mobile-first platform to report cases, dispatch alerts, and manage rehabilitation — connecting all stakeholders.
                </Paragraph>
              </Card>
            </div>
          </div>

          {/* Rescue & Care Videos side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <video
              src="/videos/feature-rescue.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-xl w-full h-[250px] sm:h-[300px] object-cover shadow-md"
            />
            <video
              src="/videos/feature-care.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-xl w-full h-[250px] sm:h-[300px] object-cover shadow-md"
            />
          </div>
        </div>
      </Content>



      <Content className="py-16 px-6 md:px-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left Image */}
          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/rescue-cats.jpg"
              alt="How We Work Overview"
              width={600}
              height={600}
              className="object-cover rounded-xl"
            />
          </div>

          {/* Right Steps */}
          <div className="space-y-8">
            <h1 className="text-4xl  ">How We Work?</h1>
            {[
              {
                title: "Report",
                description:
                  "User uploads a photo, location, and brief description — alerts nearby responders instantly.",
                icon: <BookOutlined className="text-white text-2xl" />,
                color: "bg-blue-500",
              },
              {
                title: "Dispatch",
                description:
                  "Vets, IVRI, volunteers, and police get real-time alerts with geolocation.",
                icon: <VideoCameraOutlined className="text-white text-2xl" />,
                color: "bg-green-500",
              },
              {
                title: "On-site Care",
                description:
                  "Rescue teams stabilize the animal and transport to clinic safely.",
                icon: <SafetyCertificateOutlined className="text-white text-2xl" />,
                color: "bg-purple-500",
              },
              {
                title: "Treatment & Rehab",
                description:
                  "Medical care, observation, and rehabilitation at shelters.",
                icon: <HeartOutlined className="text-white text-2xl" />,
                color: "bg-pink-500",
              },
              {
                title: "Adoption / Release",
                description:
                  "Adoption drives, foster networks, or safe release to original habitat.",
                icon: <TeamOutlined className="text-white text-2xl" />,
                color: "bg-yellow-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 hover:scale-105 transition-transform duration-300"
              >
                {/* Icon Circle */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${step.color} shadow-lg`}
                >
                  {step.icon}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{`${index + 1}. ${step.title}`}</h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>


      {/* Gallery Section */}
      <Content className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center">Photo Gallery</Title>
          <Paragraph className="text-center mb-8">Snapshots from rescue missions, treatment, and adoption programs.</Paragraph>
          <Row gutter={[16, 16]}>
            {gallery.map((src, i) => (
              <Col xs={12} md={6} key={i}>
                <Card
                  hoverable
                  cover={<Image src={src} alt={`Gallery ${i + 1}`} width={400} height={250} className="rounded-md object-cover" />}
                >
                  <Card.Meta avatar={<PictureOutlined />} title={`Story ${i + 1}`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* Media & Videos */}
      <Content className="py-16 px-6 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center">Media & Rescue Stories</Title>
          <Row gutter={[16, 16]} className="mt-6">
            {videos.map((video) => (
              <Col xs={24} sm={12} md={8} lg={6} key={video.id}>
                <Card hoverable cover={<Image src={video.thumb} alt={video.title} width={400} height={250} className="object-cover rounded-md" />}>
                  <Card.Meta title={video.title} description={<Button type="link">Watch</Button>} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      {/* FAQs and Documents */}
      <Content className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <Row gutter={32}>
            <Col xs={24} md={12}>
              <Title level={2}>Frequently Asked Questions</Title>
              <Collapse
                items={faqs.map((f, i) => ({
                  key: i,
                  label: f.q,
                  children: <p>{f.a}</p>,
                }))}
              />
            </Col>
            <Col xs={24} md={12}>
              {/* This is required to render messages */}
              {contextHolder}

              <Title level={2}>Downloads & Resources</Title>
              <List>
                {["Project Proposal (PDF)", "Volunteer Handbook", "SOP: Emergency Rescue"].map((item, i) => (
                  <List.Item key={i}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // prevent default link behavior
                        msgApi.info("Coming Soon!"); // show "Coming Soon" via message instance
                      }}
                    >
                      {item}
                    </a>
                  </List.Item>
                ))}
              </List>
            </Col>
          </Row>
        </div>
      </Content>


      {/* Achievements + Metrics */}
      <Content className="py-12 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center">Key Achievements & Metrics</Title>
          <Row gutter={32} className="mt-8 text-center">
            <Col xs={24} md={8}>
              <Statistic title="Animals Rescued" value={12500} />
            </Col>
            <Col xs={24} md={8}>
              <Statistic title="Volunteers" value={2400} />
            </Col>
            <Col xs={24} md={8}>
              <Statistic title="Adoptions Facilitated" value={5600} />
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Title level={4} className="!text-white">About Bejuwaan</Title>
            <Paragraph className="text-gray-300">A digital solution for stray animal welfare connecting citizens, vets, IVRI, NGOs and authorities to ensure rapid rescue and care.</Paragraph>
            <div className="flex items-center space-x-4 mt-4">
              <Image src="/images/gov-seal.png" alt="Gov Seal" width={64} height={64} />
              <div>
                <div className="font-semibold">NAVODAYA Programme</div>
                <div className="text-sm text-gray-400">Supported initiative</div>
              </div>
            </div>
          </div>

          <div>
            <Title level={4} className="!text-white">Contact & Support</Title>
            <p><MailOutlined /> support@bejuwaan.org</p>
            <p><PhoneOutlined /> 1800-123-456</p>
            <Button type="primary" className="mt-4">Donate</Button>
          </div>

          <div>
            <Title level={4} className="!text-white">Quick Links</Title>
            <Menu
              theme="dark"
              mode="vertical"
              items={[
                { key: 'home', label: 'Home' },
                { key: 'about', label: 'About' },
                { key: 'programs', label: 'Programs' },
                { key: 'resources', label: 'Resources' },
              ]}
            />

          </div>
        </div>

        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Bejuwaan / National Animal Rescue Mission. All rights reserved.
        </div>
      </Footer>



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

    </Layout >
  );
}