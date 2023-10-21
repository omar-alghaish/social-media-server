import asyncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";
import ApiError from "../utils/apiError.js";

export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

export const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .filter()
      .paginate(documentsCounts)
      .search()
      .sort();
    const { mongooseQuery, pagination } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, pagination, data: documents });
  });

export const getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOption) {
      query = query.populate(populationOption);
    }

    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No ${Model} for this id ${id}`), 404);
    }
    res.status(204).send();
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No ${Model} for this id ${req.params.id}`),
        404
      );
    }
    res.status(200).json({ data: document });
  });
