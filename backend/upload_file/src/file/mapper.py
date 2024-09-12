from fastapi import UploadFile

from src.authorization.schemas import SubjectData
from src.database.models import *
from src.common.mappers import BaseMapper
from src.file.schemas import FileSchema


class FileInputMapper(BaseMapper[UploadFile, FileModel]):
    def mapping(self, file: UploadFile, subject_data: SubjectData):
        return FileModel(name=file.filename, owner_id=subject_data.id, details={})


class FileDBMapper(BaseMapper[FileModel, FileSchema]):
    def mapping(self, file: FileModel):
        return FileSchema.from_orm(file)
