from io import BytesIO
from PIL import Image
import random
import string
import cv2
from fastapi import UploadFile
import numpy as np

from src.common.schemas import MessageSchema
from src.common.services.unit_of_work import IUnitOfWork
from src.database.exceptions import *
from src.file.exceptions import *
from src.file.mapper import *
from src.file.phrases import *
from src.loader.base import BaseLoaderService


class FileService:
    def __init__(self, uow: IUnitOfWork, loader: BaseLoaderService):
        self.__uow = uow
        self.__loader = loader

    async def upload_file(
        self, file: UploadFile, subject_data: SubjectData, gen_blur_img: bool
    ):
        async with self.__uow:
            try:
                old_name = file.filename
                file.filename = self.__gen_name(file)
                if await self.__loader.load_file(file):
                    fdm = FileDBMapper()
                    fim = FileInputMapper()

                    file_db = fim.mapping(file, subject_data)
                    file_db.details["old_name"] = old_name

                    if gen_blur_img:
                        cv2_img = np.array(Image.open(file.file))
                        image = cv2.blur(cv2_img, (50, 50))
                        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                        abr = file.filename.split(".")[-1]
                        _, im_buf_arr = cv2.imencode(f".{abr}", image)

                        file.file = BytesIO(im_buf_arr)
                        file.filename = f"blur_{file.filename}"
                        if await self.__loader.load_file(file):
                            blur_file_db = fim.mapping(file, subject_data)

                            blur_file_db.details["old_name"] = old_name
                            blur_file_db = await self.__uow.files.add(blur_file_db)
                            blur_file_dict = fdm.mapping(blur_file_db).model_dump()
                            del blur_file_dict["created_at"]
                            file_db.details["blur_image"] = blur_file_dict
                    file_db = await self.__uow.files.add(file_db)
                    await self.__uow.commit()
                    return fdm.mapping(file_db)
            except UniqueViolationException as e:
                raise FileUniqueNameException() from e
            except ForeignKeyViolationException as e:
                raise BadRequestException(message=FILE_NOT_OWNER) from e
            except AddItemException as e:
                raise AnyServiceException(message=FILE_ADD_FAILED) from e

    async def delete_file(self, id: int):
        async with self.__uow:
            try:
                file = await self.__uow.files.get_by_id(id)
                if await self.__loader.delete_file(file.name):
                    await self.__uow.files.delete(id=id)

                    blur_image = file.details.get("blur_image", None)
                    if blur_image:
                        if await self.__loader.delete_file(blur_image["name"]):
                            await self.__uow.files.delete(id=blur_image["id"])

                    await self.__uow.commit()
                    return MessageSchema(message=FILE_DELETED)
            except FileNotFoundError as e:
                raise FileNotFoundException() from e
            except (GetItemByIdException, DeleteItemException) as e:
                raise AnyServiceException(message=FILE_DELETE_FAILED) from e

    def __gen_name(self, file: UploadFile):
        s = file.filename.replace(" ", "_")
        return f"{self.__gen_random_str(20)}_{s}"

    def __gen_random_str(self, n: int):
        seq = string.ascii_uppercase + string.digits
        return "".join(random.choice(seq) for _ in range(n))
