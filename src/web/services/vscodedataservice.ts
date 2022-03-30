import http  from "../common/http-common";
import webpage from "../types/webtemplates";
class vscodedataservice {
  getWebfiles() {
    return http.get<Array<webpage>>("/entity");
  }
  get(id: string) {
    return http.get<webpage>(`/entity/${id}`);
  }
  create(data: webpage) {
    return http.post<webpage>("/entity", data);
  }
  update(data: webpage, id: any) {
    return http.put<any>(`/entity/${id}`, data);
  }
  delete(id: any) {
    return http.delete<any>(`/entity/${id}`);
  }
  deleteAll() {
    return http.delete<any>(`/entity`);
  }
  findById(src: string) {
    return http.get<Array<webpage>>(`/entity?src=${src}`);
  }
}
export default new vscodedataservice();
