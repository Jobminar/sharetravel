import { Service, ServiceType } from "../model/servicesModel.js";

const createServiceType = async (req, res) => {
  try {
    const serviceTypeData = {
      ...req.body,
      serviceTypeImage: req.file.buffer, // Assuming the image is sent as a file in the request
    };
    const serviceType = new ServiceType(serviceTypeData);
    await serviceType.save();
    res.status(201).json(serviceType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find({});
    res.json(serviceTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).populate("serviceType");
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createServiceType,
  getServiceTypes,
  createService,
  getServices,
  updateService,
  deleteService,
};
